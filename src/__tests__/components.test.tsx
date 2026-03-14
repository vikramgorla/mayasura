import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton, SkeletonCard } from '@/components/ui/skeleton';
import { Avatar } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

describe('Button component', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders with brand variant', () => {
    const { container } = render(<Button variant="brand">Action</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-blue-600');
  });

  it('renders disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });
});

describe('Badge component', () => {
  it('renders with text', () => {
    render(<Badge>Status</Badge>);
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders with success variant', () => {
    const { container } = render(<Badge variant="success">Active</Badge>);
    const badge = container.firstChild;
    expect((badge as HTMLElement).className).toContain('bg-emerald-100');
  });
});

describe('Input component', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders with value', () => {
    render(<Input value="test" onChange={() => {}} />);
    expect(screen.getByDisplayValue('test')).toBeInTheDocument();
  });
});

describe('Card component', () => {
  it('renders card with header and content', () => {
    render(
      <Card>
        <CardHeader><CardTitle>Title</CardTitle></CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});

describe('Skeleton components', () => {
  it('renders skeleton', () => {
    const { container } = render(<Skeleton className="h-10 w-10" />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('renders skeleton card', () => {
    const { container } = render(<SkeletonCard />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});

describe('Avatar component', () => {
  it('renders initials', () => {
    render(<Avatar name="John Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders single initial for single name', () => {
    render(<Avatar name="John" />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });
});

describe('Progress component', () => {
  it('renders with value', () => {
    const { container } = render(<Progress value={50} />);
    expect(container.querySelector('.bg-blue-600')).toBeInTheDocument();
  });
});
