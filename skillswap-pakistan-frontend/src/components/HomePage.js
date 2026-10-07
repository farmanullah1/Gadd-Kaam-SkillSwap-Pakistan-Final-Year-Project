import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';
import { useNavigate } from 'react-router-dom';
import '../styles/homepage.css'; 

import { 
  Star, Shield, ArrowRight, User, CheckCircle, Search, Zap, Sparkles, Quote
} from 'lucide-react';

function HomePage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [user, setUser] = useState(null);

  // --- 1. Hero Dynamic Text State (Typewriter Effect) ---
  const [heroIndex, setHeroIndex] = useState(0);
  const heroWords = [
    "Futures", "Community", "Trust", "Careers", "Dreams", 
    "Connections", "Opportunities", "Friendships", "Confidence", 
    "Networks", "Success", "Pathways", "Independence", 
    "Experience", "Hope", "Stability", "Expertise", 
    "Reputation", "Livelihoods", "Unity"
  ];
  const [typingClass, setTypingClass] = useState('typing');

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Remove the cursor/typing effect (start deleting)
      setTypingClass('removing'); 
      
      setTimeout(() => {
        // 2. Change the word
        setHeroIndex((prev) => (prev + 1) % heroWords.length);
        // 3. Restart typing animation
        setTypingClass('typing');
      }, 1000); // Time to delete old word
      
    }, 2500); // Total cycle time per word

    return () => clearInterval(interval);
  }, []);

  // --- 2. Women's Zone Dynamic Text State (Fade Effect) ---
  const [womenIndex, setWomenIndex] = useState(0);
  const womenWords = ["Women", "Sisters", "Growth", "Empowerment", "Safety"];
  const [womenFade, setWomenFade] = useState('fade-in');

  useEffect(() => {
    const timeout = setTimeout(() => {
        const interval = setInterval(() => {
            setWomenFade('fade-out');
            setTimeout(() => {
                setWomenIndex((prev) => (prev + 1) % womenWords.length);
                setWomenFade('fade-in');
            }, 500);
        }, 3000);
        return () => clearInterval(interval);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  // --- 3. Testimonials Carousel State (3 at a time) ---
  const [testimonialStartIndex, setTestimonialStartIndex] = useState(0);
  const testimonials = [
    { id: 1, quote: "Gadd Kaam changed my life. I learned to code by teaching English!", name: "Ali Khan", details: "Web Developer • Karachi", img: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 2, quote: "The Women's Zone is a blessing. I feel so safe trading cooking skills.", name: "Fatima Bibi", details: "Home Chef • Lahore", img: "https://randomuser.me/api/portraits/women/44.jpg" },
    { id: 3, quote: "I found a plumber within minutes who needed help with his CV.", name: "Hamza Raza", details: "Teacher • Islamabad", img: "https://randomuser.me/api/portraits/men/86.jpg" },
    { id: 4, quote: "Finally, a platform that values skills over money. Highly recommended!", name: "Sara Ahmed", details: "Graphic Designer • Multan", img: "https://randomuser.me/api/portraits/women/68.jpg" },
    { id: 5, quote: "I swapped my gardening skills for guitar lessons. Amazing experience!", name: "Bilal Sheikh", details: "Musician • Peshawar", img: "https://randomuser.me/api/portraits/men/41.jpg" },
    { id: 6, quote: "Great initiative for students to learn new skills without cost.", name: "Zainab Ali", details: "Student • Quetta", img: "https://randomuser.me/api/portraits/women/33.jpg" },
    { id: 7, quote: "Repaired my AC in exchange for social media management. Win-win!", name: "Usman Ghani", details: "Digital Marketer • Faisalabad", img: "https://randomuser.me/api/portraits/men/11.jpg" },
    { id: 8, quote: "I taught basic accounting and got my wedding dress stitched perfectly.", name: "Hina Altaf", details: "Accountant • Sialkot", img: "https://randomuser.me/api/portraits/women/12.jpg" },
    { id: 9, quote: "Found a great mentor for Python programming here.", name: "Zain Malik", details: "Student • Hyderabad", img: "https://randomuser.me/api/portraits/men/22.jpg" },
    { id: 10, quote: "Swapped homemade biryani for math tutoring for my son.", name: "Nida Yasir", details: "Housewife • Gujranwala", img: "https://randomuser.me/api/portraits/women/25.jpg" },
    { id: 11, quote: "Helped a neighbor move house, and he fixed my laptop. Simple and effective.", name: "Fahad Mustafa", details: "IT Support • Karachi", img: "https://randomuser.me/api/portraits/men/36.jpg" },
    { id: 12, quote: "Learned calligraphy in exchange for teaching yoga.", name: "Mahira Khan", details: "Yoga Instructor • Lahore", img: "https://randomuser.me/api/portraits/women/55.jpg" },
    { id: 13, quote: "Got my car tuned up by offering legal advice on a contract.", name: "Barrister Aamir", details: "Lawyer • Islamabad", img: "https://randomuser.me/api/portraits/men/58.jpg" },
    { id: 14, quote: "Fantastic community! I traded photography for SEO services.", name: "Saba Qamar", details: "Photographer • Rawalpindi", img: "https://randomuser.me/api/portraits/women/60.jpg" },
    { id: 15, quote: "Best way to save money while getting professional services.", name: "Irfan Pathan", details: "Shopkeeper • Sargodha", img: "https://randomuser.me/api/portraits/men/61.jpg" },
    { id: 16, quote: "I offered content writing and got a logo designed for my startup.", name: "Sana Javed", details: "Entrepreneur • Bahawalpur", img: "https://randomuser.me/api/portraits/women/62.jpg" },
    { id: 17, quote: "Fixed a washing machine and got free haircuts for a month!", name: "Nasir Hussain", details: "Technician • Sukkur", img: "https://randomuser.me/api/portraits/men/73.jpg" },
    { id: 18, quote: "Trading skills builds such a strong sense of community.", name: "Maria B", details: "Fashion Designer • Lahore", img: "https://randomuser.me/api/portraits/women/75.jpg" },
    { id: 19, quote: "Learned how to bake cakes by teaching Quran recitation.", name: "Hafiz Abdullah", details: "Tutor • Multan", img: "https://randomuser.me/api/portraits/men/78.jpg" },
    { id: 20, quote: "Safe, secure, and very easy to use. Love the women-only zone.", name: "Ayesha Omar", details: "Artist • Karachi", img: "https://randomuser.me/api/portraits/women/79.jpg" },
    { id: 21, quote: "I got my resume revamped in exchange for fitness training sessions.", name: "Shoaib Akhtar", details: "Gym Trainer • Islamabad", img: "https://randomuser.me/api/portraits/men/82.jpg" },
    { id: 22, quote: "Swapped my painting skills for driving lessons. Highly recommend!", name: "Hania Aamir", details: "Student • Peshawar", img: "https://randomuser.me/api/portraits/women/83.jpg" },
    { id: 23, quote: "A lifesaver for freelancers looking to network and trade.", name: "Basit Ali", details: "Freelancer • Quetta", img: "https://randomuser.me/api/portraits/men/85.jpg" },
    { id: 24, quote: "Got my thesis proofread in exchange for homemade pickles.", name: "Parveen Shakir", details: "Researcher • Jamshoro", img: "https://randomuser.me/api/portraits/women/88.jpg" },
    { id: 25, quote: "Taught video editing and learned how to play the flute.", name: "Danish Taimoor", details: "Video Editor • Lahore", img: "https://randomuser.me/api/portraits/men/90.jpg" },
    { id: 26, quote: "The verification process gives me peace of mind.", name: "Kubra Khan", details: "Architect • Karachi", img: "https://randomuser.me/api/portraits/women/91.jpg" },
    { id: 27, quote: "Helped with interior design and got my taxes filed.", name: "Imran Abbas", details: "Interior Designer • Islamabad", img: "https://randomuser.me/api/portraits/men/92.jpg" },
    { id: 28, quote: "Great platform for finding local help without spending cash.", name: "Yumna Zaidi", details: "Teacher • Faisalabad", img: "https://randomuser.me/api/portraits/women/93.jpg" },
    { id: 29, quote: "I traded electrician work for a professional portrait shoot.", name: "Asif Raza", details: "Electrician • Sialkot", img: "https://randomuser.me/api/portraits/men/94.jpg" },
    { id: 30, quote: "Learned MS Excel by offering conversational Urdu practice.", name: "Maya Ali", details: "Admin Assistant • Gujrat", img: "https://randomuser.me/api/portraits/women/95.jpg" },
    { id: 31, quote: "Swapped carpentry work for a customized diet plan.", name: "Junaid Khan", details: "Carpenter • Mardan", img: "https://randomuser.me/api/portraits/men/5.jpg" },
    { id: 32, quote: "Got my bike fixed in exchange for biology tutoring.", name: "Kinza Hashmi", details: "Student • Larkana", img: "https://randomuser.me/api/portraits/women/6.jpg" },
    { id: 33, quote: "This app is revolutionary for the Pakistani gig economy.", name: "Feroze Khan", details: "Blogger • Karachi", img: "https://randomuser.me/api/portraits/men/7.jpg" },
    { id: 34, quote: "I learned pottery while teaching someone how to use Photoshop.", name: "Sajal Aly", details: "Graphic Designer • Lahore", img: "https://randomuser.me/api/portraits/women/8.jpg" },
    { id: 35, quote: "Traded plumbing services for a website for my small business.", name: "Rashid Minhas", details: "Plumber • Rawalpindi", img: "https://randomuser.me/api/portraits/men/9.jpg" },
    { id: 36, quote: "Got urgent medical advice in exchange for car detailing.", name: "Dr. Shaista", details: "General Physician • Multan", img: "https://randomuser.me/api/portraits/women/10.jpg" },
    { id: 37, quote: "Helped a student with physics and got my garden landscaped.", name: "Sir Javed", details: "Professor • Abbottabad", img: "https://randomuser.me/api/portraits/men/13.jpg" },
    { id: 38, quote: "Swapped embroidery for mobile app development lessons.", name: "Urwa Hocane", details: "Artist • Karachi", img: "https://randomuser.me/api/portraits/women/14.jpg" },
    { id: 39, quote: "I love the community spirit here. Everyone is so helpful.", name: "Ahsan Khan", details: "Social Worker • Peshawar", img: "https://randomuser.me/api/portraits/men/15.jpg" },
    { id: 40, quote: "Got my generator fixed in exchange for resume writing.", name: "Mehwish Hayat", details: "HR Manager • Islamabad", img: "https://randomuser.me/api/portraits/women/16.jpg" },
    { id: 41, quote: "Taught guitar and learned how to ride a bike.", name: "Sheheryar Munawar", details: "Musician • Lahore", img: "https://randomuser.me/api/portraits/men/17.jpg" },
    { id: 42, quote: "A wonderful way to utilize my free time productively.", name: "Ramsha Khan", details: "Student • Hyderabad", img: "https://randomuser.me/api/portraits/women/18.jpg" },
    { id: 43, quote: "Swapped data entry work for a month of lunch deliveries.", name: "Muneeb Butt", details: "Clerk • Karachi", img: "https://randomuser.me/api/portraits/men/19.jpg" },
    { id: 44, quote: "Learned embroidery and taught basic computer skills.", name: "Iqra Aziz", details: "Teacher • Faisalabad", img: "https://randomuser.me/api/portraits/women/20.jpg" },
    { id: 45, quote: "Fixed a leaking roof in exchange for wedding photography.", name: "Yasir Hussain", details: "Contractor • Lahore", img: "https://randomuser.me/api/portraits/men/21.jpg" },
    { id: 46, quote: "Got my thesis bound and printed in exchange for coding help.", name: "Sarah Khan", details: "Student • Islamabad", img: "https://randomuser.me/api/portraits/women/23.jpg" },
    { id: 47, quote: "Traded legal drafting for a customized wooden table.", name: "Nauman Ijaz", details: "Lawyer • Sialkot", img: "https://randomuser.me/api/portraits/men/24.jpg" },
    { id: 48, quote: "Swapped makeup services for a professional headshot.", name: "Ayeza Khan", details: "Beautician • Karachi", img: "https://randomuser.me/api/portraits/women/26.jpg" },
    { id: 49, quote: "Taught cricket skills and got help with my biology assignment.", name: "Babar Azam", details: "Cricketer • Lahore", img: "https://randomuser.me/api/portraits/men/27.jpg" },
    { id: 50, quote: "Amazing platform! Swapped baking for henna application.", name: "Mawra Hocane", details: "Baker • Rawalpindi", img: "https://randomuser.me/api/portraits/women/28.jpg" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
        setTestimonialStartIndex((prev) => (prev + 1) % testimonials.length);
    }, 3000); 
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const visibleTestimonials = [
    testimonials[testimonialStartIndex],
    testimonials[(testimonialStartIndex + 1) % testimonials.length],
    testimonials[(testimonialStartIndex + 2) % testimonials.length],
  ];

  // --- 4. Featured Skills Carousel (4 at a time, rotate every 10s) ---
  const [skillStartIndex, setSkillStartIndex] = useState(0);
  const allSkills = [
    { id: 1, title: "Tractor Repair", user: "Ahmed Khan", rating: 4.8, reviews: 23, imageUrl: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=1000" },
    { id: 2, title: "Tailoring & Dress Making", user: "Fatima Bibi", rating: 4.9, reviews: 41, imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1000" },
    { id: 3, title: "Basic Computer Skills", user: "Ali Raza", rating: 4.7, reviews: 15, imageUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=1000" },
    { id: 4, title: "Home Cooking Lessons", user: "Ayesha Malik", rating: 5.0, reviews: 30, imageUrl: "https://plus.unsplash.com/premium_photo-1763576573316-77cf1671abcf?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 5, title: "Graphic Design", user: "Bilal Ahmed", rating: 4.6, reviews: 12, imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 6, title: "English Tutoring", user: "Sana Mir", rating: 4.9, reviews: 50, imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1000" },
    { id: 7, title: "Plumbing Services", user: "Rashid Ali", rating: 4.5, reviews: 8, imageUrl: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=1000" },
    { id: 8, title: "Mobile Repair", user: "Kamran Khan", rating: 4.7, reviews: 19, imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=1000" },
    { id: 9, title: "Electrician Services", user: "Usman Ghani", rating: 4.8, reviews: 27, imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1000" },
    { id: 10, title: "Henna Art (Mehndi)", user: "Hina Altaf", rating: 5.0, reviews: 45, imageUrl: "https://plus.unsplash.com/premium_photo-1661862397518-8e50332b6e97?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 11, title: "Web Development", user: "Zainab Malik", rating: 4.9, reviews: 33, imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000" },
    { id: 12, title: "AC Maintenance", user: "Fahad Mustafa", rating: 4.6, reviews: 14, imageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=1000" },
    { id: 13, title: "Event Photography", user: "Hamza Ali", rating: 4.8, reviews: 21, imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000" },
    { id: 14, title: "Quran Recitation Tutor", user: "Hafiz Abdullah", rating: 5.0, reviews: 60, imageUrl: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=1000" },
    { id: 15, title: "Hand Embroidery", user: "Parveen Shakir", rating: 4.9, reviews: 38, imageUrl: "https://images.unsplash.com/photo-1568288796918-03e7d93306bd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 16, title: "Mathematics Tutoring", user: "Sir Junaid", rating: 4.7, reviews: 29, imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000" },
    { id: 17, title: "Woodworking & Carpentry", user: "Nasir Hussain", rating: 4.6, reviews: 11, imageUrl: "https://images.unsplash.com/photo-1547609434-b732edfee020?q=80&w=1144&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 18, title: "Home Baking", user: "Saba Qamar", rating: 5.0, reviews: 52, imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1000" },
    { id: 19, title: "SEO Optimization", user: "Basit Ali", rating: 4.5, reviews: 9, imageUrl: "https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?auto=format&fit=crop&q=80&w=1000" },
    { id: 20, title: "Bridal Makeup", user: "Mahira Khan", rating: 4.9, reviews: 40, imageUrl: "https://plus.unsplash.com/premium_photo-1724762178439-1f93ad3f3cb6?q=80&w=1104&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 21, title: "Car Repair & Tuning", user: "Irfan Pathan", rating: 4.7, reviews: 18, imageUrl: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=1000" },
    { id: 22, title: "Urdu Calligraphy", user: "Amjad Islam", rating: 4.8, reviews: 16, imageUrl: "https://images.unsplash.com/photo-1582201942988-13e60e4556ee?auto=format&fit=crop&q=80&w=1000" },
    { id: 23, title: "Kitchen Gardening", user: "Nida Yasir", rating: 4.6, reviews: 25, imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=1000" },
    { id: 24, title: "Video Editing", user: "Danish Taimoor", rating: 4.7, reviews: 20, imageUrl: "https://plus.unsplash.com/premium_photo-1679079456083-9f288e224e96?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 25, title: "Data Entry & Typing", user: "Sana Javed", rating: 4.5, reviews: 13, imageUrl: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&q=80&w=1000" },
    { id: 26, title: "Personal Fitness Training", user: "Shoaib Akhtar", rating: 4.9, reviews: 35, imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=1000" },
    { id: 27, title: "Interior Decorating", user: "Maria B", rating: 4.8, reviews: 22, imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1000" },
    { id: 28, title: "Solar Panel Installation", user: "Imran Abbas", rating: 4.7, reviews: 15, imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=1000" },
    { id: 29, title: "Bookkeeping & Tax Help", user: "Asif Raza", rating: 4.6, reviews: 10, imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1000" },
    { id: 30, title: "Social Media Marketing", user: "Hania Aamir", rating: 4.8, reviews: 31, imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1000" },
    { id: 31, title: "Car Washing", user: "Bilal", rating: 4.8, reviews: 31, imageUrl: "https://plus.unsplash.com/premium_photo-1664303228186-a61e7dc91597?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 32, title: "Digital marketing", user: "Ahmad", rating: 4.8, reviews: 31, imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1115&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 50, title: "Social Media Marketing", user: "Hania Aamir", rating: 4.8, reviews: 31, imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1000" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
        setSkillStartIndex((prev) => (prev + 1) % allSkills.length);
    }, 10000); 
    return () => clearInterval(interval);
  }, [allSkills.length]);

  const visibleSkills = [
    allSkills[skillStartIndex],
    allSkills[(skillStartIndex + 1) % allSkills.length],
    allSkills[(skillStartIndex + 2) % allSkills.length],
    allSkills[(skillStartIndex + 3) % allSkills.length],
  ];

  // --- Scroll Reveal Logic ---
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.reveal');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const openHelplinePopup = () => setShowHelplinePopup(true);
  const closeHelplinePopup = () => setShowHelplinePopup(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleOfferSkillClick = () => {
    user ? navigate('/offer-skill') : navigate('/login');
  };

  const handleFindSkillClick = () => {
    navigate('/marketplace');
  };

  const handleWomenZoneClick = () => {
    if (user) {
      if (user.gender === 'Female') {
        navigate('/women-zone');
      } else {
        alert("Access Restricted: This zone is for female users only.");
      }
    } else {
      navigate('/login');
    }
  };

  const howItWorksSteps = [
    { id: 1, titleKey: "step1_title", descriptionKey: "step1_description", icon: <User size={32} /> },
    { id: 2, titleKey: "step2_title", descriptionKey: "step2_description", icon: <Search size={32} /> }, 
    { id: 3, titleKey: "step3_title", descriptionKey: "step3_description", icon: <Star size={32} /> },
  ];

  return (
    <div className="home-page-container">
      <Navbar onHelplineClick={openHelplinePopup} onLogout={handleLogout} user={user} />

      {/* --- HERO SECTION --- */}
      <main className="hero-section animated-bg">
        <div className="hero-content">
          <div className="hero-text-wrapper reveal fade-left">
            <div className="hero-badge bounce-in">
              <Zap size={16} fill="currentColor" /> {t('app_name')}
            </div>
            
            <h1 className="hero-headline">
              Trade Skills, Build
              <span className={`dynamic-typewriter ${typingClass}`}>
                {heroWords[heroIndex]}
              </span>.
            </h1>
            
            <p className="hero-subtext">{t("hero_subtext")}</p>
            <div className="hero-buttons">
              <button className="btn btn-primary-orange btn-lg hover-pulse" onClick={handleOfferSkillClick}>
                {t("hero_offer_skill_btn")} <ArrowRight size={20} />
              </button>
              <button className="btn btn-secondary-outline btn-lg" onClick={handleFindSkillClick}>
                {t("hero_find_skill_btn")}
              </button>
            </div>
          </div>
          
          <div className="hero-visual reveal fade-right">
            <div className="image-stack float-anim">
                <img 
                  src="/Gadd_Kaam.png" 
                  alt="Community" 
                  className="hero-main-image" 
                  onError={(e) => {e.target.onerror=null; e.target.src="https://placehold.co/500x500?text=Gadd+Kaam"}}
                />
            </div>
            <div className="hero-floating-card card-success float-anim-delayed">
              <CheckCircle size={24} className="icon-success" />
              <div>
                <strong>Skill Swapped!</strong>
                <span className="small-text">Just now</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </main>

      {/* --- HOW IT WORKS --- */}
      <section className="section-container how-it-works-section centered-section">
        <div className="section-header text-center reveal fade-up">
          <h2 className="section-title">{t("how_it_works_title")}</h2>
          <p className="section-subtitle">{t("how_it_works_subtitle")}</p>
        </div>
        <div className="steps-grid">
          {howItWorksSteps.map((step, index) => (
            <div className="step-card reveal fade-up" style={{transitionDelay: `${index * 150}ms`}} key={step.id}>
              <div className="step-number-bg">0{index + 1}</div>
              <div className="step-content">
                <div className="step-icon-wrapper pulse-anim">
                  {step.icon}
                </div>
                <h3 className="step-title">{t(step.titleKey)}</h3>
                <p className="step-description">{t(step.descriptionKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FEATURED SKILLS (4 Cards, Auto-Rotate) --- */}
      {!user && (
        <section className="section-container featured-skills-section centered-section">
          <div className="section-header text-center reveal fade-up">
            <h2 className="section-title">{t("featured_skills_title")} <Sparkles size={24} className="sparkle-icon"/></h2>
            <p className="section-subtitle">Discover what's popular in your area.</p>
            
            <button onClick={handleFindSkillClick} className="btn-link center-link">
              {t("view_all_link")} <ArrowRight size={16} />
            </button>
          </div>
          <div className="skills-grid">
            {visibleSkills.map((skill, idx) => (
              <div 
                className="home-skill-card reveal fade-up fade-in-anim" 
                key={`${skill.id}-${idx}`} // Unique key for animation triggering
                onClick={handleFindSkillClick}
              >
                <div className="skill-image-container">
                  <img src={skill.imageUrl} alt={skill.title} className="skill-image" />
                  <div className="skill-overlay">
                    <span className="view-text">{t("view_details_link")}</span>
                  </div>
                </div>
                <div className="skill-content">
                  <h3 className="skill-title">{skill.title}</h3>
                  <div className="skill-meta">
                    <span className="skill-user"><User size={14}/> {skill.user}</span>
                    <div className="skill-rating">
                      <Star size={14} fill="#e38b40" stroke="#e38b40" />
                      <span>{skill.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- WOMEN'S ZONE BANNER --- */}
      {(!user || (user && user.gender === 'Female')) && (
        <section className="section-container women-zone-section-wrapper reveal scale-up centered-section">
          <div className="women-zone-banner">
            <div className="women-zone-text">
              <div className="badge-pink"><Shield size={16} /> {t("women_only_zone_tag")}</div>
              <h2 className="women-zone-title">
                A Safe Space for <span className={`dynamic-text-pink ${womenFade}`}>{womenWords[womenIndex]}</span>.
              </h2>
              <p className="women-zone-description">{t("women_zone_description")}</p>
              <button className="btn btn-primary-pink" onClick={handleWomenZoneClick}>
                {t("women_zone_button")}
              </button>
            </div>
            <div className="women-zone-visual">
               <img src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=500&q=80" alt="Women Zone" className="women-zone-img float-anim" />
            </div>
          </div>
        </section>
      )}

      {/* --- ANIMATED TESTIMONIALS (3 Cards) --- */}
      {!user && (
        <section className="section-container testimonials-section centered-section">
          <h2 className="section-title text-center reveal fade-up">{t("testimonials_title")}</h2>
          
          <div className="testimonials-grid reveal fade-up">
            {visibleTestimonials.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="testimonial-card fade-in-anim">
                    <div className="quote-icon">“</div>
                    <p className="testimonial-quote">{item.quote}</p>
                    <div className="testimonial-author">
                        <img 
                            src={item.img} 
                            alt={item.name} 
                            className="author-avatar" 
                        />
                        <div>
                            <p className="author-name">{item.name}</p>
                            <p className="author-details">{item.details}</p>
                        </div>
                    </div>
                </div>
            ))}
          </div>
        </section>
      )}

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={closeHelplinePopup} />}
    </div>
  );
}

export default HomePage;