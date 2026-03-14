import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with text content', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('renders as a button element', () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  // Variant tests
  it('renders default variant', () => {
    const { container } = render(<Button variant="default">Default</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-zinc-900');
  });

  it('renders destructive variant', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-red-600');
  });

  it('renders outline variant', () => {
    const { container } = render(<Button variant="outline">Outline</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('border');
  });

  it('renders secondary variant', () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-zinc-100');
  });

  it('renders ghost variant', () => {
    const { container } = render(<Button variant="ghost">Ghost</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('hover:bg-zinc-100');
  });

  it('renders link variant', () => {
    const { container } = render(<Button variant="link">Link</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('underline-offset-4');
  });

  it('renders brand variant', () => {
    const { container } = render(<Button variant="brand">Brand</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-violet-700');
  });

  // Size tests
  it('renders sm size', () => {
    const { container } = render(<Button size="sm">Small</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('h-8');
  });

  it('renders default size', () => {
    const { container } = render(<Button size="default">Default</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('h-9');
  });

  it('renders lg size', () => {
    const { container } = render(<Button size="lg">Large</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('h-11');
  });

  it('renders xl size', () => {
    const { container } = render(<Button size="xl">XL</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('h-12');
  });

  it('renders icon size', () => {
    const { container } = render(<Button size="icon">🔔</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('w-9');
  });

  // Disabled state
  it('renders disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.className).toContain('disabled:opacity-50');
  });

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<Button className="custom-class">Custom</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('custom-class');
  });

  // Click handler
  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Forwarded ref
  it('forwards ref', () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
