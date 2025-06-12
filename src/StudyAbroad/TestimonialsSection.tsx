import React, { useState, useEffect } from "react";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  MapPin,
  GraduationCap,
  Calendar,
} from "lucide-react";
import { useSwipeable } from "react-swipeable";

// Type definitions
interface Testimonial {
  name: string;
  university: string;
  country: string;
  program: string;
  quote: string;
  rating: number;
  image: string;
  year: string;
}

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Handle swipe gestures
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      handleUserInteraction();
      nextTestimonial();
    },
    onSwipedRight: () => {
      handleUserInteraction();
      prevTestimonial();
    },
  });

  // Autoplay functionality
  useEffect(() => {
    const intervalId = isAutoplay
      ? setInterval(() => nextTestimonial(), 5000)
      : undefined;

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAutoplay, currentTestimonial]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextTestimonial();
      if (e.key === "ArrowLeft") prevTestimonial();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleUserInteraction = () => {
    setIsAutoplay(false);
    setTimeout(() => setIsAutoplay(true), 10000);
  };

  const testimonials: Testimonial[] = [
    {
      name: "Sarah Johnson",
      university: "Harvard University",
      country: "USA",
      program: "Master's in Business Administration",
      quote:
        "The guidance I received made my application process seamless. From visa assistance to scholarship recommendations, everything was handled professionally. I couldn't have asked for better support in achieving my dream of studying at Harvard.",
      rating: 5,
      image: "https://i.ibb.co/WWmCzy4z/download-9.jpg",
      year: "2023",
    },
    {
      name: "Michael Brown",
      university: "University of Edinburgh",
      country: "Scotland",
      program: "PhD in Engineering",
      quote:
        "Studying in Scotland has been life-changing. The educational quality and cultural experience exceeded all my expectations. The application support was exceptional - they helped me navigate through every step of the process.",
      rating: 5,
      image: "https://i.ibb.co/Ldj52zmJ/download-10.jpg",
      year: "2022",
    },
    {
      name: "Aisha Patel",
      university: "Technical University of Munich",
      country: "Germany",
      program: "Master's in Computer Science",
      quote:
        "The free tuition in Germany is amazing. Thanks to expert guidance, I secured my spot at TUM and even got a scholarship! The support didn't end there - they helped with accommodation and settling in too.",
      rating: 5,
      image: "https://i.ibb.co/DHZjvkT8/download-11.jpg",
      year: "2023",
    },
    {
      name: "James Chen",
      university: "University of Toronto",
      country: "Canada",
      program: "Bachelor's in Medicine",
      quote:
        "Getting into medical school in Canada seemed impossible until I found this support. They helped me understand the requirements, prepare my applications, and even provided interview coaching. Now I'm living my dream!",
      rating: 5,
      image: "https://i.ibb.co/995LGPYN/download-8.jpg",
      year: "2022",
    },
    {
      name: "Emma Wilson",
      university: "University of Melbourne",
      country: "Australia",
      program: "Master's in Environmental Science",
      quote:
        "Australia was always my dream destination. The team made it possible by guiding me through the complex visa process and helping me secure funding. The post-arrival support was incredible too!",
      rating: 5,
      image: "https://i.ibb.co/yFqJCwjd/download-12.jpg",
      year: "2023",
    },
    {
      name: "Ahmed Hassan",
      university: "Sorbonne University",
      country: "France",
      program: "Master's in International Relations",
      quote:
        "Studying in Paris has been a dream come true. The application process was smooth thanks to the excellent guidance. They even helped me improve my French before I arrived. Merci beaucoup!",
      rating: 5,
      image: "https://i.ibb.co/nqd9BpNw/download-13.jpg",
      year: "2022",
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="py-8 bg-gradient-to-br from-purple-100 via-blue-50 to-purple-50 overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative mb-6 text-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-purple-200 rounded-full opacity-30 blur-3xl"></div>
          </div>
          <div className="relative">
            <div className="flex items-center justify-center mb-2">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-purple-800" />
              <h2 className="mx-4 text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-yellow-500">
                Success Stories
              </h2>
              <div className="h-px w-24 bg-gradient-to-l from-transparent to-purple-800" />
            </div>
            <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto">
              Hear from students who achieved their dreams of studying abroad with our guidance.
            </p>
          </div>
        </div>

        {/* Testimonial Carousel */}
        <div {...handlers} onClick={handleUserInteraction} className="relative max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-700 ease-in-out">
            <div className="flex flex-col md:flex-row">
              {/* Left Side - Image */}
              <div className="md:w-2/5 bg-gradient-to-br from-purple-600 to-indigo-700 p-6 md:p-8 flex flex-col justify-center items-center text-white">
                <div className="relative mb-6">
                  <Quote className="absolute -top-4 -left-4 w-8 h-8 text-purple-300 opacity-50" />
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white/30 shadow-lg"
                  />
                </div>
                <h4 className="font-bold text-xl md:text-2xl text-center mb-1">
                  {testimonials[currentTestimonial].name}
                </h4>
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-300 fill-current" />
                  ))}
                </div>
                <div className="space-y-2 text-center">
                  <div className="flex justify-center gap-2">
                    <GraduationCap className="w-4 h-4 text-purple-200 mb-4" />
                    <p className="text-sm">{testimonials[currentTestimonial].program}</p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-200 mb-4" />
                    <p className="text-sm">
                      {testimonials[currentTestimonial].university},{" "}
                      {testimonials[currentTestimonial].country}
                    </p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-200 mb-4" />
                    <p className="text-sm">Class of {testimonials[currentTestimonial].year}</p>
                  </div>
                </div>
              </div>

              {/* Right Side - Quote */}
              <div className="md:w-3/5 p-6 md:p-10 flex items-center">
                <div className="relative">
                  <p className="text-gray-700 text-sm sm:text-base md:text-lg italic mb-8 leading-relaxed px-2 sm:px-0">
                    <span className="absolute -top-3 -left-3 text-4xl text-purple-200">"</span>
                    {testimonials[currentTestimonial].quote}
                    <span className="absolute -bottom-5 -right-3 text-4xl text-purple-200">"</span>
                  </p>
                  <div className="hidden md:flex justify-end gap-2">
                    <button
                      onClick={prevTestimonial}
                      className="bg-purple-100 hover:bg-purple-200 rounded-full p-2 text-purple-600"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="bg-purple-100 hover:bg-purple-200 rounded-full p-2 text-purple-600"
                      aria-label="Next"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Absolute Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:shadow-xl text-purple-600 z-10"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextTestimonial}
            className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:shadow-xl text-purple-600 z-10"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Autoplay Progress Bar */}
          <div className="w-full h-1 bg-purple-100 rounded mt-4">
            <div
              key={currentTestimonial}
              className="h-full bg-purple-600 transition-all duration-[5000ms] ease-linear"
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {/* Indicator Dots */}
        <div className="flex justify-center mt-6 gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentTestimonial(index);
                handleUserInteraction();
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 transform ${index === currentTestimonial
                  ? "bg-purple-600 scale-125"
                  : "bg-gray-300 hover:bg-purple-300 scale-100"
                }`}
              aria-label={`Testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
export default TestimonialsSection;
