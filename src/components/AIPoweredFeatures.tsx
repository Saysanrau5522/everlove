
import { motion } from 'framer-motion';
import { Sparkles, Heart, MessageSquare, ArrowRight, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AIPoweredFeatures = () => {
  const features = [
    {
      icon: <Heart className="h-6 w-6 text-love-deep" />,
      title: "Relationship Insights",
      description: "AI-powered analysis of your love patterns and relationship dynamics to help you grow together."
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-love-deep" />,
      title: "Love Conversation Guide",
      description: "Get personalized conversation starters and communication tips based on your relationship stage."
    },
    {
      icon: <BrainCircuit className="h-6 w-6 text-love-deep" />,
      title: "Emotion Recognition",
      description: "Our AI helps you understand emotional patterns in your letters and communications."
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-love-medium" />
              <h2 className="text-3xl md:text-4xl font-serif">
                AI-Powered Love Insights
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-4">
              Our AI companion helps you nurture more meaningful connections through personalized insights.
            </p>
          </motion.div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-8 border border-gray-100 shadow-paper hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute -right-6 -top-6 w-16 h-16 bg-love-light/20 rounded-full blur-xl" />
              
              <div className="w-14 h-14 rounded-full bg-love-light/30 flex items-center justify-center mb-6 relative z-10">
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-medium mb-3 relative z-10">{feature.title}</h3>
              <p className="text-gray-600 relative z-10">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/community">
            <Button className="bg-love-medium hover:bg-love-deep text-white px-6 py-2 rounded-full inline-flex items-center gap-2">
              <span>Explore AI Features</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AIPoweredFeatures;
