// ============================================================
// Webhook da Kiwify — libera o acesso do aluno quando o pagamento
// é aprovado.
//
// COMO CONFIGURAR:
// 1. No painel da Kiwify, cadastre a URL deste webhook:
//    https://SEU-SITE.netlify.app/.netlify/functions/kiwify-webhook?token=SEU_TOKEN_SECRETO
//    (o token é escolhido por você — qualquer texto difícil de adivinhar)
// 2. No Netlify, vá em Site settings -> Environment variables e crie:
//    - KIWIFY_WEBHOOK_TOKEN   (o mesmo token que você usou na URL acima)
//    - SUPABASE_URL           (a Project URL do seu Supabase)
//    - SUPABASE_SERVICE_ROLE_KEY (a chave "service_role/secret" do Supabase
//      — Settings -> API Keys. NUNCA coloque essa chave no front-end.)
//
// IMPORTANTE: o formato exato do corpo (payload) que a Kiwify envia pode
// mudar com o tempo. Este código tenta reconhecer os campos mais comuns
// (email do comprador e status do pagamento), mas se a Kiwify alterar o
// formato, peça ao Claude Code: "aqui está o payload real que a Kiwify
// está enviando pro meu webhook: [cole o payload de um teste real]. Ajuste
// este arquivo pra ler os campos corretos."
// ============================================================

const { createClient } = require("@supabase/supabase-js");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  // Confere o token secreto passado na URL do webhook
  const token = event.queryStringParameters && event.queryStringParameters.token;
  if (!token || token !== process.env.KIWIFY_WEBHOOK_TOKEN) {
    return { statusCode: 401, body: "Token inválido" };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: "JSON inválido" };
  }

  // Tenta localizar e-mail e status em alguns formatos comuns de payload.
  // Ajuste estes caminhos conforme o payload real da Kiwify (ver aviso acima).
  const email =
    payload.Customer?.email ||
    payload.customer?.email ||
    payload.email ||
    payload.buyer?.email;

  const statusBruto = (
    payload.order_status ||
    payload.status ||
    payload.event ||
    ""
  ).toString().toLowerCase();

  const produto =
    payload.Product?.name ||
    payload.product?.name ||
    payload.product_name ||
    null;

  if (!email) {
    return { statusCode: 400, body: "E-mail do comprador não encontrado no payload" };
  }

  // Estados que indicam pagamento aprovado nos webhooks mais comuns da Kiwify.
  const aprovados = ["paid", "approved", "aprovado", "compra aprovada", "order_approved"];
  const cancelados = ["refunded", "chargeback", "canceled", "cancelado", "reembolsado"];

  let novoStatus = null;
  if (aprovados.some((s) => statusBruto.includes(s))) novoStatus = "ativo";
  if (cancelados.some((s) => statusBruto.includes(s))) novoStatus = "cancelado";

  if (!novoStatus) {
    // Evento que não exige ação (ex: "boleto gerado", ainda não pago)
    return { statusCode: 200, body: "Evento recebido, nenhuma ação necessária" };
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Upsert por e-mail: se já existir uma linha (usuário já se cadastrou),
  // atualiza o status; senão, cria a liberação pendente de vínculo
  // (o gatilho do banco conecta ao user_id assim que o aluno criar a senha).
  const { data: existente } = await supabase
    .from("acessos")
    .select("user_id")
    .eq("email", email)
    .maybeSingle();

  if (existente) {
    await supabase
      .from("acessos")
      .update({ status: novoStatus, produto, liberado_em: new Date().toISOString() })
      .eq("email", email);
  } else {
    await supabase.from("acessos").insert({
      user_id: null,
      email,
      status: novoStatus,
      produto,
      liberado_em: new Date().toISOString(),
    });
  }

  return { statusCode: 200, body: "Acesso atualizado com sucesso" };
};
