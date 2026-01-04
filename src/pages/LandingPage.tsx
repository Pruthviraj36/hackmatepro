import { Link } from 'react-router-dom';
import { Zap, Users, Shield, Trophy, ArrowRight, Code, Sparkles, Target } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Smart Matching',
    description: 'Find teammates who complement your skills and share your hackathon goals.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your contact details are only shared after mutual interest is confirmed.',
  },
  {
    icon: Trophy,
    title: 'Track Achievements',
    description: 'Showcase your hackathon history, projects, and wins on your profile.',
  },
  {
    icon: Code,
    title: 'Skill-Based Filtering',
    description: 'Filter teammates by skills, experience level, and interests.',
  },
];

const stats = [
  { value: '10K+', label: 'Developers' },
  { value: '500+', label: 'Hackathons' },
  { value: '2K+', label: 'Teams Formed' },
  { value: '50+', label: 'Wins Together' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">HackMate</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn-ghost text-sm">
                Log in
              </Link>
              <Link to="/signup" className="btn-primary text-sm">
                Get started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent text-accent-foreground rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Privacy-first teammate matching
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Find your perfect
            <span className="text-primary"> hackathon team</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with developers, designers, and builders who share your passion. Match based on skills, interests, and goals—your contact info stays private until you both say yes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup" className="btn-primary text-lg px-8 py-3 flex items-center justify-center gap-2">
              Start matching <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/discover" className="btn-secondary text-lg px-8 py-3">
              Browse teammates
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border bg-muted/30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything you need to find great teammates
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built by hackers, for hackers. We understand what makes a great team.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="card-base p-6 card-hover">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How HackMate works
            </h2>
          </div>
          <div className="space-y-6">
            {[
              { step: '1', title: 'Create your profile', description: 'Add your skills, interests, and hackathon history. Let others know what you\'re looking for.' },
              { step: '2', title: 'Discover teammates', description: 'Browse profiles filtered by skills, experience, and current hackathons. Find your perfect match.' },
              { step: '3', title: 'Express interest', description: 'Click "Interested" on profiles you like. They won\'t see your contact info—just your profile.' },
              { step: '4', title: 'Match and connect', description: 'When they\'re interested too, it\'s a match! Now you can see each other\'s contact details.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card-base p-8 sm:p-12 bg-gradient-to-br from-primary/5 to-accent">
            <Target className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Ready to find your next team?
            </h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of developers building amazing projects together.
            </p>
            <Link to="/signup" className="btn-primary text-lg px-8 py-3 inline-flex items-center gap-2">
              Create free account <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">HackMate</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 HackMate. Privacy-first teammate matching.
          </p>
        </div>
      </footer>
    </div>
  );
}
