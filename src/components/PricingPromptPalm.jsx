import React from 'react';
import { Check } from 'lucide-react';

export default function PricingPromptPalm() {
  const plans = [
    {
      name: 'PromptPalm Basic',
      price: 29.90,
      description: 'Perfeito para iniciantes',
      features: [
        '1000+ prompts curados',
        'Atualização mensal',
        'Suporte por email',
        'Sem exportação CSV',
        'Sem acesso API'
      ],
      cta: 'Começar Agora',
      ctaLink: 'https://kiwify.com.br/checkout/7024b210-8053-11f1-9d11-cf4a08acba23',
      highlight: false
    },
    {
      name: 'PromptPalm Pro',
      price: 99.90,
      description: 'Para profissionais e empresas',
      features: [
        'Todos os prompts (ilimitado)',
        'Atualização semanal',
        'Suporte prioritário via chat',
        'Exportação em CSV',
        'Acesso à API',
        'Customização de prompts'
      ],
      cta: 'Começar Agora',
      ctaLink: 'https://kiwify.com.br/checkout/cfa194b0-8053-11f1-85e8-61572b6fab9d',
      highlight: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            PromptPalm — Biblioteca de Prompts
          </h1>
          <p className="text-xl text-slate-600">
            Acesso a mais de 1000 prompts de IA curados e testados
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-lg p-8 flex flex-col ${
                plan.highlight
                  ? 'bg-blue-600 text-white ring-2 ring-blue-600 scale-105 shadow-2xl'
                  : 'bg-white text-slate-900 shadow-lg'
              }`}
            >
              {/* Badge */}
              {plan.highlight && (
                <div className="mb-4 inline-block bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold w-fit">
                  Mais Popular
                </div>
              )}

              {/* Title */}
              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <p className={`mb-6 ${plan.highlight ? 'text-blue-100' : 'text-slate-600'}`}>
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-5xl font-bold">R$ {plan.price.toFixed(2)}</span>
                <p className={`text-sm ${plan.highlight ? 'text-blue-100' : 'text-slate-600'}`}>
                  por mês
                </p>
              </div>

              {/* CTA Button */}
              
                href={plan.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3 rounded-lg font-semibold mb-8 transition-all text-center ${
                  plan.highlight
                    ? 'bg-white text-blue-600 hover:bg-slate-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {plan.cta}
              </a>

              {/* Features */}
              <div className="space-y-4">
                {plan.features.map((feature, fidx) => (
                  <div key={fidx} className="flex items-start gap-3">
                    <Check
                      size={20}
                      className={plan.highlight ? 'text-blue-200' : 'text-blue-600'}
                      strokeWidth={3}
                    />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ / Info */}
        <div className="mt-16 max-w-4xl mx-auto bg-white rounded-lg p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Perguntas Frequentes</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Posso cancelar a qualquer momento?</h4>
              <p className="text-slate-600">Sim, você pode cancelar sua assinatura quando quiser, sem compromissos.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Como funciona o acesso?</h4>
              <p className="text-slate-600">Após o pagamento, você ganha acesso imediato à biblioteca completa de prompts.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Há garantia de satisfação?</h4>
              <p className="text-slate-600">Sim! Garantia de 7 dias para reembolso total se não ficar satisfeito.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
