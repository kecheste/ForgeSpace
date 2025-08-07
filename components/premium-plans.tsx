'use client';

import { CheckIcon, ZapIcon } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

function PremiumPlans({
  onOpenChange,
  open,
}: {
  onOpenChange: () => void;
  open?: boolean;
}) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(
    'annual'
  );
  const currentPlan = 'Starter';

  const plans = [
    {
      name: 'Starter',
      price: {
        monthly: 0,
        annual: 0,
      },
      description: 'For personal projects',
      features: [
        'Personal workspace',
        '5 ideas per month',
        'Basic AI analysis',
        'Email support',
      ],
      buttonText: 'Current Plan',
      ctaVariant: 'outline',
    },
    {
      name: 'Pro',
      price: {
        monthly: 19,
        annual: 150,
      },
      description: 'For growing teams',
      features: [
        'Unlimited ideas',
        'Advanced AI analysis',
        'Unlimited collaborators',
        'Team workspaces',
        'Priority support',
        'Development tools',
      ],
      buttonText: 'Upgrade',
      ctaVariant: 'primary',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: {
        monthly: 'Custom',
        annual: 'Custom',
      },
      description: 'For organizations',
      features: [
        'All Pro features',
        'Dedicated manager',
        'Custom integrations',
        'On-premise options',
        'SLA guarantees',
      ],
      buttonText: 'Contact Us',
      ctaVariant: 'outline',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-2xl p-0 bg-white rounded-xl border border-gray-100 shadow-xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-lg font-semibold text-gray-900 text-center">
            Upgrade Your Creativity
          </DialogTitle>

          <div className="flex justify-center mt-4">
            <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1 text-xs rounded-md ${billingCycle === 'monthly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-3 py-1 text-xs rounded-md ${billingCycle === 'annual' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
              >
                Annual (20% off)
              </button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-12 gap-4 px-6 pb-6 mt-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`col-span-4 relative p-4 rounded-lg border transition-all ${
                plan.popular
                  ? 'border-blue-300 bg-blue-50/50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-2 right-4 bg-blue-600 text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center">
                  <ZapIcon className="w-3 h-3 mr-1" />
                  POPULAR
                </div>
              )}

              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{plan.name}</h3>
                  {typeof plan.price[billingCycle] === 'number' ? (
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">
                        ${plan.price[billingCycle]}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">
                      {plan.price[billingCycle]}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
              </div>

              <ul className="space-y-2 mb-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <CheckIcon className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`cursor-pointer w-full text-xs py-2 px-3 rounded-md font-medium transition-colors ${
                  plan.ctaVariant === 'primary'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                {currentPlan === plan.name ? plan.buttonText : plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="px-4 pb-4 text-center">
          <p className="text-xs text-gray-500">
            Need help?{' '}
            <a href="/dashboard/help" className="text-blue-600 hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PremiumPlans;
