import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StepBasics from '@/components/wizard/StepBasics';
import { createMockBrandData } from '@/__tests__/utils';

describe('StepBasics', () => {
  const mockUpdateData = vi.fn();
  const mockOnNext = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderStep = (overrides = {}) => {
    const data = createMockBrandData(overrides);
    return render(
      <StepBasics data={data} updateData={mockUpdateData} onNext={mockOnNext} />
    );
  };

  it('renders the step heading', () => {
    renderStep();
    expect(screen.getByText('Brand Basics')).toBeInTheDocument();
  });

  it('renders industry input', () => {
    renderStep();
    expect(screen.getByPlaceholderText(/Restaurant, Fashion, SaaS/i)).toBeInTheDocument();
  });

  it('renders brand name input', () => {
    renderStep();
    expect(screen.getByPlaceholderText(/your brand name/i)).toBeInTheDocument();
  });

  it('renders tagline input', () => {
    renderStep();
    expect(screen.getByPlaceholderText(/memorable tagline/i)).toBeInTheDocument();
  });

  it('renders description textarea', () => {
    renderStep();
    expect(screen.getByPlaceholderText(/Tell us about/i)).toBeInTheDocument();
  });

  it('displays pre-filled data', () => {
    renderStep({
      name: 'My Brand',
      industry: 'Technology',
      tagline: 'Build the future',
      description: 'A tech company',
    });
    expect(screen.getByDisplayValue('My Brand')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Technology')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Build the future')).toBeInTheDocument();
    expect(screen.getByDisplayValue('A tech company')).toBeInTheDocument();
  });

  it('calls updateData when industry changes', async () => {
    const user = userEvent.setup();
    renderStep({ industry: '' });
    const input = screen.getByPlaceholderText(/Restaurant, Fashion, SaaS/i);
    await user.click(input);
    await user.type(input, 'Fashion');
    // updateData should be called for each keystroke
    expect(mockUpdateData).toHaveBeenCalled();
    const lastCall = mockUpdateData.mock.calls[mockUpdateData.mock.calls.length - 1][0];
    expect(lastCall).toHaveProperty('industry');
  });

  it('calls updateData when brand name changes', async () => {
    const user = userEvent.setup();
    renderStep({ name: '' });
    const input = screen.getByPlaceholderText(/your brand name/i);
    await user.type(input, 'NewBrand');
    expect(mockUpdateData).toHaveBeenCalled();
    const lastCall = mockUpdateData.mock.calls[mockUpdateData.mock.calls.length - 1][0];
    expect(lastCall).toHaveProperty('name');
  });

  it('disables Continue button when name is empty', () => {
    renderStep({ name: '', industry: 'Tech' });
    const button = screen.getByRole('button', { name: /continue/i });
    expect(button).toBeDisabled();
  });

  it('disables Continue button when industry is empty', () => {
    renderStep({ name: 'Test', industry: '' });
    const button = screen.getByRole('button', { name: /continue/i });
    expect(button).toBeDisabled();
  });

  it('enables Continue button when name and industry are filled', () => {
    renderStep({ name: 'Test Brand', industry: 'Technology' });
    const button = screen.getByRole('button', { name: /continue/i });
    expect(button).not.toBeDisabled();
  });

  it('calls onNext when Continue is clicked', async () => {
    const user = userEvent.setup();
    renderStep({ name: 'Test Brand', industry: 'Technology' });
    const button = screen.getByRole('button', { name: /continue/i });
    await user.click(button);
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('renders AI Suggest buttons', () => {
    renderStep();
    const aiButtons = screen.getAllByText(/AI Suggest/i);
    expect(aiButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('disables AI name suggest when no industry is set', () => {
    renderStep({ industry: '' });
    // The AI suggest button for names should be disabled when no industry
    const buttons = screen.getAllByRole('button');
    // Find the AI suggest button near the name field
    const aiSuggestButtons = buttons.filter(b => b.textContent?.includes('AI Suggest'));
    // At least one should be disabled
    const disabledAi = aiSuggestButtons.filter(b => b.hasAttribute('disabled'));
    expect(disabledAi.length).toBeGreaterThanOrEqual(1);
  });
});
