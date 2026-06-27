import './BookingStepper.css';

interface Step {
  number: number;
  label: string;
  icon: string;
}

const STEPS: Step[] = [
  { number: 1, label: 'Choose Time', icon: '📅' },
  { number: 2, label: 'Your Details', icon: '👤' },
  { number: 3, label: 'Payment', icon: '💳' },
  { number: 4, label: 'Confirmation', icon: '✅' },
];

interface BookingStepperProps {
  currentStep: number;
}

export default function BookingStepper({ currentStep }: BookingStepperProps) {
  return (
    <div className="stepper">
      {STEPS.map((step, idx) => {
        const isCompleted = step.number < currentStep;
        const isActive = step.number === currentStep;
        const isUpcoming = step.number > currentStep;

        return (
          <div className="stepper__item" key={step.number}>
            <div className={`stepper__circle ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''} ${isUpcoming ? 'upcoming' : ''}`}>
              {isCompleted ? '✓' : step.icon}
            </div>
            <div className="stepper__label-wrap">
              <span className={`stepper__label ${isActive ? 'active' : ''} ${isUpcoming ? 'upcoming' : ''}`}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`stepper__connector ${isCompleted ? 'completed' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
