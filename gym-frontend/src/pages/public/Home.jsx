/**
 * Home page - Main landing page for DOJO Fitness.
 * Premium marketing page with hero, features, and CTAs.
 */
import { Link } from "react-router-dom";
import CTAButton from "../../components/public/CTAButton";
import SectionWrapper from "../../components/public/SectionWrapper";

const Home = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920')] bg-cover bg-center opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-20">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight">
            TRANSFORM
            <br />
            <span className="text-primary-400">YOUR BODY</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join the elite. Train with the best. Achieve the impossible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton to="/try-us" size="xl" variant="primary">
              Try Us Free
            </CTAButton>
            <CTAButton to="/join-us" size="xl" variant="outline">
              Join Now
            </CTAButton>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <SectionWrapper bgColor="dark" padding="py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            WELCOME TO <span className="text-primary-400">DOJO</span>
          </h2>
          <div className="w-24 h-1 bg-primary-400 mx-auto mb-6"></div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We're not just a gym. We're a movement. A community of warriors
            dedicated to pushing limits, breaking barriers, and achieving
            greatness. Every rep. Every set. Every day.
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper bgColor="darker" padding="py-24">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            WHY <span className="text-primary-400">CHOOSE US</span>
          </h2>
          <div className="w-24 h-1 bg-primary-400 mx-auto"></div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              image:
                "https://www.afton.in/s/55b31c5573bc5c994472673c/67078476012d570036c17ef3/whatsapp-image-2024-10-01-at-16-46-14_ca5ea0c4-640x640.jpg",
              title: "Elite Equipment",
              desc: "State-of-the-art machines and free weights.",
            },
            {
              image:
                "https://thumbs.dreamstime.com/b/personal-trainer-motivates-client-doing-push-ups-gym-47296874.jpg",
              title: "Expert Trainers",
              desc: "Certified professionals who push you to excel.",
            },
            {
              image:
                "https://media.gettyimages.com/id/515238274/photo/modern-and-big-gym.jpg?s=612x612&w=gi&k=20&c=H5bygwm83pb_AkSnANXjDqed3Dtsqr_u_Y6EYbBq314=",
              title: "24/7 Access",
              desc: "Train on your schedule. Early morning, late night.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-primary-500 transition-all"
            >
              {/* Image */}
              <div className="h-64 overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Facilities */}
      {/* <SectionWrapper bgColor="dark" padding="py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            WORLD-CLASS <span className="text-primary-400">FACILITIES</span>
          </h2>
          <div className="w-24 h-1 bg-primary-400 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            "Cardio Zone",
            "Strength Training",
            "Functional Training",
            "Recovery Area",
            "Locker Rooms",
            "Nutrition Bar",
            "Group Classes",
            "Personal Training",
          ].map((facility, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-primary-500 transition-all text-center"
            >
              <div className="text-3xl mb-3">🏋️</div>
              <h4 className="text-white font-semibold">{facility}</h4>
            </div>
          ))}
        </div>
      </SectionWrapper> */}

      {/* DOJOPass / Membership Plans */}
      <SectionWrapper bgColor="dark" padding="py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            DOJO<span className="text-primary-400">PASS</span>
          </h2>
          <p className="text-gray-400 mt-2">
            One membership. Multiple ways to train.
          </p>
          <div className="w-24 h-1 bg-primary-400 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "ELITE",
              image:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqEyFHvuFMAc-knprFmaQcUBLgB4bTxJwL9Q&s",
              accent: "text-yellow-400",
              features: [
                "Unlimited group classes",
                "Access to all ELITE & PRO gyms",
                "At-home live workouts",
              ],
            },
            {
              name: "PRO",
              image:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqEyFHvuFMAc-knprFmaQcUBLgB4bTxJwL9Q&s",
              accent:
                "bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-[length:200%_100%] bg-clip-text text-transparent animate-[shine_2.5s_linear_infinite]",
              features: [
                "Unlimited PRO gym access",
                "2 ELITE sessions / month",
                "At-home live workouts",
              ],
            },
            {
              name: "SELECT",
              image:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqEyFHvuFMAc-knprFmaQcUBLgB4bTxJwL9Q&s",
              accent: "text-white",
              features: [
                "One center of your choice",
                "Limited sessions in other gyms",
                "At-home live workouts",
              ],
            },
          ].map((plan, index) => (
            <div
              key={index}
              className="relative min-h-[420px] rounded-2xl overflow-hidden bg-gray-900 border border-gray-700 hover:border-primary-500 transition-all group"
            >
              {/* Image */}
              <img
                src={plan.image}
                alt={plan.name}
                className="h-72 md:h-80 w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

              {/* Content */}
              <div className="absolute bottom-0 p-8 w-full">
                <p className="text-sm uppercase tracking-wide text-gray-300">
                  DOJOPASS
                </p>
                <h3 className={`text-3xl font-extrabold ${plan.accent}`}>
                  {plan.name}
                </h3>

                <ul className="mt-4 space-y-2 text-gray-300 text-sm">
                  {plan.features.map((feature, i) => (
                    <li key={i}>• {feature}</li>
                  ))}
                </ul>

                <Link
                  to="contact"
                  className="
                    inline-flex items-center justify-center gap-1
                    px-6 py-3 mt-4
                    rounded-xl
                    border border-white/30
                    text-white font-medium
                    bg-transparent
                    transition-all duration-300
                    hover:bg-white/10
                    hover:border-white/50
                    hover:-translate-y-0.5
                    hover:shadow-lg hover:shadow-white/10
                    backdrop-blur-sm
                  "
                >
                  Learn More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Trainers Section */}
      <SectionWrapper bgColor="darker" padding="py-24">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            MEET OUR <span className="text-primary-400">TRAINERS</span>
          </h2>
          <div className="w-24 h-1 bg-primary-400 mx-auto"></div>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Trainer 1 */}
          <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-primary-500 transition-all">
            <div className="h-64 overflow-hidden">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqEyFHvuFMAc-knprFmaQcUBLgB4bTxJwL9Q&s"
                alt="Yash Chawan"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Yash Chawan</h3>
              <p className="text-primary-400 text-sm mb-3">Yoga Specialist</p>
              <p className="text-gray-400 text-sm">
                Expert in flexibility, mindfulness, and holistic fitness.
              </p>
            </div>
          </div>

          {/* Trainer 2 */}
          <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-primary-500 transition-all">
            <div className="h-64 overflow-hidden">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDldv7x_8OWo7xs0JODLStYsmJdTBDW5m1nw&s"
                alt="Rohit Mohite"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Rohit Mohite
              </h3>
              <p className="text-primary-400 text-sm mb-3">Strength Trainer</p>
              <p className="text-gray-400 text-sm">
                Focused on strength building and muscle conditioning.
              </p>
            </div>
          </div>

          {/* Trainer 3 */}
          <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-primary-500 transition-all">
            <div className="h-64 overflow-hidden">
              <img
                src="https://img.freepik.com/free-photo/low-angle-view-unrecognizable-muscular-build-man-preparing-lifting-barbell-health-club_637285-2497.jpg?semt=ais_hybrid&w=740&q=80"
                alt="Kshitij Sawant"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Kshitij Sawant
              </h3>
              <p className="text-primary-400 text-sm mb-3">Special Trainer</p>
              <p className="text-gray-400 text-sm">
                Customized training programs for peak performance.
              </p>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Testimonials */}
      <SectionWrapper bgColor="dark" padding="py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            WHAT OUR <span className="text-primary-400">MEMBERS SAY</span>
          </h2>
          <div className="w-24 h-1 bg-primary-400 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah Johnson",
              role: "Member since 2022",
              text: "DOJO transformed my life. The trainers are incredible.",
            },
            {
              name: "Mike Chen",
              role: "Member since 2021",
              text: "Best gym I've ever been to. The equipment is top-notch.",
            },
            {
              name: "Emma Davis",
              role: "Member since 2023",
              text: "I achieved my fitness goals faster than I imagined.",
            },
          ].map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl p-8 border border-gray-700"
            >
              <div className="text-primary-400 text-2xl mb-4">"</div>
              <p className="text-gray-300 mb-6">{testimonial.text}</p>
              <div>
                <p className="text-white font-semibold">{testimonial.name}</p>
                <p className="text-gray-400 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Final CTA */}
      <SectionWrapper bgColor="darker" padding="py-24">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            READY TO <span className="text-primary-400">START?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of members who have transformed their lives at DOJO
            Fitness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton to="/try-us" size="xl" variant="primary">
              Book Free Trial
            </CTAButton>
            <CTAButton to="/join-us" size="xl" variant="outline">
              Become a Member
            </CTAButton>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default Home;
