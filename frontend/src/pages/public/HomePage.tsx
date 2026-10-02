import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  Monitor,
  Shield,
  Users,
  BarChart2,
  Sparkles,
  Zap,
  Eye,
  Lock,
  Brain,
  Globe,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Star,
  Award,
  Terminal,
  Layers,
  Cpu,
  FileText,
  Clock,
  AlertTriangle,
  Video,
  Mic,
  Camera,
  Wifi,
  Battery,
  ChevronDown,
  Building2,
  Computer,
  Scale,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

const trustIndicators = [
  { label: 'SOC 2 Type II', icon: Shield },
  { label: 'GDPR Compliant', icon: Lock },
  { label: '99.9% Uptime', icon: Monitor },
  { label: 'Enterprise Ready', icon: Building2 },
]

const features = [
  {
    icon: Eye,
    title: 'Real-time Face Detection',
    description: 'Continuous webcam monitoring with <100ms latency. Detects presence, absence, and multiple faces instantly.',
    metrics: ['<100ms latency', '99.2% accuracy', 'Multi-face alerts'],
  },
  {
    icon: Brain,
    title: 'Behavioral Analysis',
    description: 'AI-powered analysis of gaze patterns, head pose, and attention markers. Flags anomalies without bias.',
    metrics: ['Gaze tracking', 'Head pose estimation', 'Attention scoring'],
  },
  {
    icon: Shield,
    title: 'Integrity Indicators',
    description: 'Structured events with confidence scores and evidence references. Human-in-the-loop review workflow.',
    metrics: ['Confidence scoring', 'Evidence links', 'Review queue'],
  },
  {
    icon: Video,
    title: 'WebRTC Media Pipeline',
    description: 'Low-latency video/audio streaming with automatic quality adaptation. Records evidence clips on demand.',
    metrics: ['Adaptive bitrate', 'Clip recording', 'Screen share'],
  },
  {
    icon: FileText,
    title: 'Comprehensive Reports',
    description: 'Auto-generated interview reports with timeline, events, and integrity summary. Exportable PDF/JSON.',
    metrics: ['Timeline view', 'Event log', 'PDF export'],
  },
  {
    icon: Lock,
    title: 'Privacy-First Architecture',
    description: 'End-to-end encryption, candidate consent flows, data minimization, and configurable retention policies.',
    metrics: ['E2E encryption', 'Consent management', 'Auto-deletion'],
  },
]

const howItWorks = [
  {
    step: '01',
    title: 'Create Interview',
    description: 'HR creates interview session, configures monitoring rules, and sends invitation with unique join link.',
    icon: FileText,
  },
  {
    step: '02',
    title: 'System Check',
    description: 'Candidate completes automated browser, camera, microphone, and network validation before interview.',
    icon: Computer,
  },
  {
    step: '03',
    title: 'Live Monitoring',
    description: 'Real-time AI analysis during interview. Interviewer sees live integrity indicators and alerts.',
    icon: Eye,
  },
  {
    step: '04',
    title: 'Review & Report',
    description: 'Post-interview review with evidence, confidence scores, and auto-generated integrity report.',
    icon: CheckCircle,
  },
]

const responsibleAI = [
  {
    title: 'No Automated Decisions',
    description: 'We provide evidence and confidence scores only. Final hiring decisions always remain with human reviewers.',
    icon: AlertTriangle,
  },
  {
    title: 'Bias Mitigation',
    description: 'Models tested across demographics. Continuous monitoring for disparate impact. Regular third-party audits.',
    icon: Scale,
  },
  {
    title: 'Transparency',
    description: 'Candidates informed of monitoring scope. All detected signals explained. Open model cards available.',
    icon: Eye,
  },
  {
    title: 'Data Minimization',
    description: 'Only necessary signals collected. No raw video stored by default. Configurable retention with auto-deletion.',
    icon: Lock,
  },
]

const testimonials = [
  {
    quote: "InterviewGuard transformed our hiring process. We catch integrity issues early without creating a hostile candidate experience.",
    author: 'Sarah Chen',
    role: 'VP of Engineering, TechCorp',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    quote: "The system check feature alone saved us countless hours. Candidates come prepared, interviews start on time.",
    author: 'Michael Torres',
    role: 'Senior Engineering Manager, StartupXYZ',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
  },
  {
    quote: "Finally, a monitoring solution that respects privacy. GDPR compliant, transparent, and actually accurate.",
    author: 'Priya Patel',
    role: 'Head of Talent, GlobalFinance',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
  },
]

const stats = [
  { value: '10,000+', label: 'Interviews Monitored' },
  { value: '99.2%', label: 'Face Detection Accuracy' },
  { value: '<100ms', label: 'Analysis Latency' },
  { value: '4.9/5', label: 'Candidate Satisfaction' },
]

export function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-950">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 via-transparent to-violet-50/50 dark:from-brand-900/20 dark:via-transparent dark:to-violet-900/20" aria-hidden="true" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>Now with GPT-4o powered behavioral analysis</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-surface-900 dark:text-surface-50 mb-6">
              AI-Powered Interview{' '}
              <span className="bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent">
                Monitoring & Detection
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-surface-600 dark:text-surface-400 mb-10 max-w-2xl mx-auto">
              Protect interview integrity with real-time face detection, behavioral analysis,
              and evidence-based integrity indicators. Built for fairness, transparency, and privacy.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button asChild size="lg" className="gap-2 px-8 py-3">
                <Link to="/signup">Start Free Trial</Link>
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
              <Button variant="neutral" asChild size="lg" className="px-8 py-3">
                <Link to="/demo">Watch Demo</Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-surface-500 dark:text-surface-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success-500" aria-hidden="true" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success-500" aria-hidden="true" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success-500" aria-hidden="true" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="py-16 border-y border-surface-200 dark:border-surface-800" aria-labelledby="trust-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="trust-heading" className="sr-only">Trusted by leading companies</h2>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
            {['Acme Corp', 'Globex', 'Wayne Enterprises', 'Stark Industries', 'Umbrella Corp', 'Initech'].map((company) => (
              <span key={company} className="text-xl font-semibold text-surface-400 dark:text-surface-500">
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 lg:py-32" aria-labelledby="features-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="info" className="mb-4">Core Features</Badge>
            <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-surface-50 mb-4">
              Everything you need for interview integrity
            </h2>
            <p className="text-lg text-surface-600 dark:text-surface-400">
              Comprehensive monitoring suite designed for modern hiring teams
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={feature.title} className="group hover:shadow-xl transition-shadow duration-300 border-surface-200 dark:border-surface-800">
                <CardContent className="p-6">
                  <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-900/30 w-fit mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-heading-md font-semibold text-surface-900 dark:text-surface-50 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-surface-600 dark:text-surface-400 mb-4">{feature.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {feature.metrics.map((metric, i) => (
                      <Badge key={i} variant="neutral" className="text-xs">{metric}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 lg:py-32 bg-surface-50 dark:bg-surface-900/50" aria-labelledby="how-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="info" className="mb-4">How It Works</Badge>
            <h2 id="how-heading" className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-surface-50 mb-4">
              From setup to report in four steps
            </h2>
            <p className="text-lg text-surface-600 dark:text-surface-400">
              Streamlined workflow for HR, interviewers, and candidates
            </p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-500 to-violet-500 -translate-x-1/2" aria-hidden="true" />

            <div className="space-y-16">
              {howItWorks.map((step, index) => (
                <div key={step.step} className={cn('relative flex lg:flex-row', index % 2 === 1 && 'lg:flex-row-reverse')}>
                  <div className={cn('lg:w-1/2 lg:pr-12', index % 2 === 1 && 'lg:pl-12 lg:pr-0')}>
                    <div className={cn('relative', index % 2 === 1 && 'text-right')}>
                      <span className="text-4xl font-bold text-brand-500/20 dark:text-brand-500/10">{step.step}</span>
                      <div className={cn('absolute top-8 left-1/2 w-4 h-4 rounded-full bg-brand-500 border-4 border-white dark:border-surface-950 -translate-x-1/2 lg:block hidden', index % 2 === 1 && 'left-1/2')} aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mt-4 mb-2">{step.title}</h3>
                    <p className="text-lg text-surface-600 dark:text-surface-400">{step.description}</p>
                  </div>
                  <div className={cn('lg:w-1/2 lg:pl-12 flex items-center', index % 2 === 1 && 'lg:pr-12 lg:pl-0')}>
                    <div className={cn('relative w-full max-w-md mx-auto', index % 2 === 1 && 'ml-auto')}>
                      <div className="aspect-video bg-surface-100 dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-800 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <step.icon className="h-16 w-16 text-brand-500 dark:text-brand-400 relative z-10" aria-hidden="true" />
                        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                          <Badge variant="neutral">Live</Badge>
                          <Badge variant="success">Secure</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="trust" className="py-24 lg:py-32" aria-labelledby="trust-heading-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="warning" className="mb-4">Responsible AI</Badge>
            <h2 id="trust-heading-2" className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-surface-50 mb-4">
              Built on principles of responsible AI
            </h2>
            <p className="text-lg text-surface-600 dark:text-surface-400">
              We believe monitoring should protect integrity without compromising fairness or privacy
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {responsibleAI.map((principle, index) => (
              <Card key={principle.title} className="border-surface-200 dark:border-surface-800">
                <CardContent className="p-6">
                  <div className="p-3 rounded-xl bg-warning-50 dark:bg-warning-900/30 w-fit mb-4">
                    <principle.icon className="h-6 w-6 text-warning-600 dark:text-warning-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-heading-sm font-semibold text-surface-900 dark:text-surface-50 mb-2">
                    {principle.title}
                  </h3>
                  <p className="text-surface-600 dark:text-surface-400">{principle.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-surface-50 dark:bg-surface-900/50" aria-labelledby="stats-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-surface-600 dark:text-surface-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32" aria-labelledby="testimonials-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="info" className="mb-4">Testimonials</Badge>
            <h2 id="testimonials-heading" className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-surface-50 mb-4">
              Trusted by hiring teams worldwide
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-surface-200 dark:border-surface-800">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="text-surface-600 dark:text-surface-400 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <img src={testimonial.avatar} alt="" className="h-10 w-10 rounded-full" />
                    <div>
                      <p className="font-medium text-surface-900 dark:text-surface-50">{testimonial.author}</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-gradient-to-br from-brand-600 via-brand-700 to-violet-700" aria-labelledby="cta-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="cta-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to protect your interview integrity?
          </h2>
          <p className="text-xl text-brand-100 mb-10 max-w-2xl mx-auto">
            Join thousands of companies using InterviewGuard for fair, transparent, and secure interviews.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-brand-700 hover:bg-brand-50 px-8 py-3 gap-2">
              <Link to="/signup">Start Free Trial</Link>
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button variant="neutral" asChild size="lg" className="border-white text-white hover:bg-white/10 px-8 py-3">
              <Link to="/demo">Schedule Demo</Link>
            </Button>
          </div>
          <p className="mt-6 text-brand-200 text-sm">
            14-day free trial • No credit card required • SOC 2 Type II certified
          </p>
        </div>
      </section>
    </div>
  )
}

