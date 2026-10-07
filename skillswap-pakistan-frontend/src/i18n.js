// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // Added LanguageDetector

i18n
  .use(LanguageDetector) // Use LanguageDetector for automatic language detection
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    lng: "en", // Explicitly set default language
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          // General Utility
          "dark_mode_toggle": "Toggle dark mode",
          "change_language": "Change language",
          "call_helpline": "Call helpline",

          // Navbar
          "navbar_home": "Home",
          "navbar_about_us": "About Us",
          "navbar_women_zone": "Women's Zone",
          "navbar_contact": "Contact",
          "navbar_login_btn": "Log In",
          "navbar_signup_btn": "Sign Up",
          "navbar_logout": "Logout",
          "navbar_dashboard": "Dashboard",
          "navbar_my_profile": "My Profile",
          "navbar_my_skills": "My Skills",
          "navbar_messages": "Messages",
          "navbar_marketplace": "Marketplace",

          // Hero Section
          "hero_headline": "Trade Skills, Build Futures.",
          "hero_subtext": "Gadd Kaam – SkillSwap Pakistan is a community where you can exchange your talents for the help you need, all without money.",
          "hero_offer_skill_btn": "Offer a Skill",
          "hero_find_skill_btn": "Find a Skill",
          "hero_title": "Connect with Local Talent",
          "hero_subtitle": "Your one-stop destination for finding and offering local services in Pakistan.",
          "hero_join_now": "Join Now",
          "hero_find_service": "Find a Service",
          "hero_find_service_desc": "Browse a wide range of services offered by skilled professionals in your area.",
          "hero_offer_skills": "Offer Your Skills",
          "hero_offer_skills_desc": "Create a profile and start earning by offering your services to the community.",
          "hero_secure_reliable": "Secure & Reliable",
          "hero_secure_reliable_desc": "We provide a secure platform for all transactions and communications.",


          // How It Works Section
          "how_it_works_title": "How It Works",
          "how_it_works_subtitle": "Joining our community is easy. Follow these simple steps to start swapping skills.",
          "step1_title": "1. Create Profile",
          "step1_description": "Sign up and list the skills you can offer. Get verified to build trust.",
          "step2_title": "2. Find & Swap",
          "step2_description": "Browse skills you need, or post a request. Connect with others to arrange a swap.",
          "step3_title": "3. Rate & Earn",
          "step3_description": "Complete the swap, leave feedback, and earn Skill Points for your contributions.",

          // Featured Skills Section
          "featured_skills_title": "Featured Skills",
          "view_all_link": "View All →",
          "view_details_link": "View Details →",

          // Testimonials Section
          "testimonials_title": "What Our Community Says",
          "testimonial1_quote": "I fixed my neighbor's water pump, and in return, his wife taught my daughter how to embroider. Gadd Kaam – SkillSwap made it possible. This is a blessing for our village.",
          "testimonial1_author_name": "Iqbal Hussain",
          "testimonial1_author_details": "Mechanic, Punjab",
          "testimonial2_quote": "As a woman, it's not always easy to find work. Through the women-only zone, I found a safe space to offer my sewing skills and learn accounting from another woman.",
          "testimonial2_author_name": "Samina Akhtar",
          "testimonial2_author_details": "Home Chef, Sindh",

          // Women's Zone Section
          "women_zone_title": "A Safe Space for Women",
          "women_zone_description": "Our Women-Only Skill Zone provides a secure and supportive environment for women to connect, learn, and trade skills with confidence.",
          "women_zone_button": "Explore the Women's Zone",

          // Footer
          "footer_tagline": "Empowering communities by connecting skills, cash-free.",
          "footer_quick_links": "Quick Links",
          "footer_support": "Support",
          "footer_follow_us": "Follow Us",
          "footer_copyright": "Gadd Kaam – SkillSwap Pakistan. All rights reserved.",
          "footer_privacy_policy": "Privacy Policy",
          "footer_terms_of_service": "Terms of Service",
          "Empowering_communities_by_connecting_skills_cash_free": "Empowering communities by connecting skills, cash-free.",


          // Language names for display
          "lang_en": "English",
          "lang_ur": "Urdu",
          "lang_sd": "Sindhi",

          // --- Dashboard Translations ---
          "dashboard_welcome_heading": "Welcome back, {{username}}!",
          "dashboard_sub_heading": "Here's a quick overview of your SkillSwap activity.",
          "skills_offered_title": "Skills Offered",
          "skills_offered_detail": "Post a skill to get started!",
          "skills_received_title": "Skills Received",
          "skills_received_detail": "Start learning new things today!",
          "unread_messages_title": "Unread Messages",
          "unread_messages_detail": "No new messages yet.",
          "find_skill_title": "Find a Skill",
          "find_skill_description": "Explore the marketplace to discover new skills and connect with talented people in your community.",
          "browse_marketplace_btn": "Browse Marketplace",
          "offer_skill_title_card": "Offer a Skill",
          "offer_skill_description_card": "Share your expertise with the community. Post a skill you can teach or a service you can provide.",
          "post_new_skill_btn": "Post a New Skill",

          // --- Profile Page Translations ---
          "profile_page_title": "My Profile",
          "profile_update_prompt": "Update your photo and personal details here.",
          "change_picture_btn": "Change Picture",
          "full_name_label": "Full Name",
          "email_address_label": "Email Address",
          "phone_number_label": "Phone Number",
          "location_label": "Location",
          "about_me_label": "About Me",
          "discard_changes_btn": "Discard Changes",
          "save_changes_btn": "Save Changes",

          // --- Offer Skill Page Translations ---
          "offer_skill_title": "Offer a New Skill",
          "offer_skill_subtitle": "Share your skills and connect with others in your community!",
          "step1_offer_skill": "Step 1: What can you offer?",
          "step1_offer_skill_desc": "Share your expertise and help others while learning something new! Choose up to 3 skills you’re confident in from the list below, or search for your own.",
          "step1_offer_skill_label": "Which top skills would you love to offer others?",
          "step1_offer_skill_placeholder": "Search for skills to offer...",
          "step2_offer_skill": "Step 2: Add more details",
          "step2_offer_skill_desc": "Add an optional photo and a description to make your listing stand out. Provide your location and contact details to help people connect with you.",
          "step2_photo_label": "Upload a Photo (Optional)",
          "step2_description_label": "Description",
          "step2_description_placeholder": "Describe what you’re offering in more detail...",
          "step2_location_label": "Location",
          "step2_location_placeholder": "e.g., Jamshoro, Pakistan",
          "step2_go_anonymous_switch": "Go Anonymous",
          "step2_remotely_switch": "Available Remotely",
          "step2_women_zone_switch": "Share in Women-Only Zone Only",
          "step3_offer_skill": "Step 3: What do you want in return?",
          "step3_offer_skill_desc": "Tell us what skills you’d like to swap for and discover new opportunities! Pick up to 3 skills you want to learn or improve from the list.",
          "step3_offer_skill_label": "What new skills are you excited to swap for?",
          "step3_offer_skill_placeholder": "Search for skills you want to learn...",
          "step4_offer_skill": "Step 4: Review & Publish",
          "step4_offer_skill_desc": "Please review all the details below. If everything looks good, publish your offer to the marketplace.",
          "step4_review_message": "By confirming, you agree to our Terms of Service and Privacy Policy.",
          "step4_confirm_publish_btn": "Confirm & Publish",
          "go_back_btn": "Back",
          "next_btn": "Next",

          // --- My Skills Page Translations ---
          "my_skills_page_title": "My Offered Skills",
          "my_skills_page_subtitle": "Manage your active skill offers and track their performance.",
          "no_skills_offered": "You haven't offered any skills yet. Post one to get started!",
          "view_full_details_btn": "View Details",
          "delete_offer_btn": "Delete Offer",
          "offer_skill_label": "Offered Skill",
          "swap_skill_label": "Wanted Skill",
          "description_label": "Description",
          "skill_not_specified": "Not specified",
          "yes": "Yes",
          "no": "No",

          // --- Marketplace Page Translations ---
          "marketplace_page_title": "Skill Marketplace",
          "marketplace_page_subtitle": "Explore skills offered by others in your community.",
          "no_skills_available": "No skills available in the marketplace right now. Check back later!",
          "request_btn": "Request",

          // --- Women Only Zone Page Translations ---
          "women_only_zone_page_title": "Women-Only Skill Zone",
          "women_only_zone_page_subtitle": "A dedicated space for women to safely share and swap skills.",
          "no_women_zone_skills_available": "No skills available in the Women-Only Zone right now. Check back later!",


          // --- Signup Page Translations ---
          "signup_join_gadd_kaam": "Join Gadd Kaam",
          "signup_start_offering_finding": "Create an account to start offering and finding skills in your community.",
          "signup_firstName_label": "First Name",
          "signup_firstName_placeholder": "Your first name",
          "signup_lastName_label": "Last Name",
          "signup_lastName_placeholder": "Your last name",
          "signup_profilePicture_label": "Profile Picture",
          "signup_no_file_chosen": "No file selected.",
          "signup_username_label": "Username",
          "signup_username_placeholder": "Choose a username",
          "signup_phoneNumber_label": "Phone Number",
          "signup_email_label": "Email",
          "signup_dateOfBirth_label": "Date of Birth",
          "signup_cnicNumber_label": "CNIC Number",
          "signup_cnicFrontPic_label": "CNIC Front Picture",
          "signup_cnicBackPic_label": "CNIC Back Picture",
          "signup_password_label": "Password",
          "signup_confirmPassword_label": "Confirm Password",
          "signup_create_account_btn": "Create Account",
          "signup_already_have_account": "Already have an account?",
          "signup_login_link": "Log in",

          // Signup Form Errors
          "signup_error_firstName_required": "First Name is required.",
          "signup_error_lastName_required": "Last Name is required.",
          "signup_error_profilePic_required": "Profile Picture is required.",
          "signup_error_username_required": "Username is required.",
          "signup_error_phoneNumber_required": "Phone Number is required.",
          "signup_error_email_required": "Email is required.",
          "signup_error_dob_required": "Date of Birth is required.",
          "signup_error_cnic_invalid": "CNIC Number must be 13 digits.",
          "signup_error_cnicFrontPic_required": "CNIC Front Picture is required.",
          "signup_error_cnicBackPic_required": "CNIC Back Picture is required.",
          "signup_error_password_required": "Password is required.",
          "signup_error_confirmPassword_required": "Passwords do not match.", // Corrected from "Confirm Password is required."
          "signup_error_passwords_mismatch": "Passwords do not match.",
          "signup_success_message": "Account created successfully!"
        },
      },
      ur: {
        translation: {
          // General Utility (Urdu)
          "dark_mode_toggle": "ڈارک موڈ ٹوگل کریں",
          "change_language": "زبان تبدیل کریں",
          "call_helpline": "ہیلپ لائن پر کال کریں",

          // Navbar (Urdu)
          "navbar_home": "ہوم",
          "navbar_about_us": "ہمارے بارے میں",
          "navbar_women_zone": "خواتین کا زون",
          "navbar_contact": "رابطہ کریں",
          "navbar_login_btn": "لاگ ان کریں",
          "navbar_signup_btn": "سائن اپ کریں",
          "navbar_logout": "لاگ آؤٹ",
          "navbar_dashboard": "ڈیش بورڈ",
          "navbar_my_profile": "میرا پروفائل",
          "navbar_my_skills": "میری مہارتیں",
          "navbar_messages": "پیغامات",
          "navbar_marketplace": "مارکیٹ پلیس",

          // Hero Section (Urdu)
          "hero_headline": "مہارتوں کا تبادلہ، مستقبل کی تعمیر۔",
          "hero_subtext": "گڈ کام – اسکل سویپ پاکستان ایک ایسی کمیونٹی ہے جہاں آپ اپنی صلاحیتوں کا تبادلہ اپنی ضرورت کی مدد کے لیے کر سکتے ہیں، بغیر پیسوں کے۔",
          "hero_offer_skill_btn": "مہارت پیش کریں",
          "hero_find_skill_btn": "مہارت تلاش کریں",
          "hero_title": "مقامی ہنر سے جڑیں",
          "hero_subtitle": "پاکستان میں مقامی خدمات تلاش کرنے اور پیش کرنے کے لیے آپ کا ون اسٹاپ منزل۔",
          "hero_join_now": "ابھی شامل ہوں",
          "hero_find_service": "خدمت تلاش کریں",
          "hero_find_service_desc": "اپنے علاقے میں ہنر مند پیشہ ور افراد کی طرف سے پیش کردہ خدمات کی وسیع رینج کو براؤز کریں۔",
          "hero_offer_skills": "اپنی مہارتیں پیش کریں",
          "hero_offer_skills_desc": "ایک پروفائل بنائیں اور کمیونٹی کو اپنی خدمات پیش کرکے کمانا شروع کریں۔",
          "hero_secure_reliable": "محفوظ اور قابل اعتماد",
          "hero_secure_reliable_desc": "ہم تمام لین دین اور مواصلات کے لیے ایک محفوظ پلیٹ فارم فراہم کرتے ہیں۔",

          // How It Works Section (Urdu)
          "how_it_works_title": "یہ کیسے کام کرتا ہے",
          "how_it_works_subtitle": "ہماری کمیونٹی میں شامل ہونا آسان ہے۔ مہارتوں کا تبادلہ شروع کرنے کے لیے ان آسان اقدامات پر عمل کریں۔",
          "step1_title": "1. پروفائل بنائیں",
          "step1_description": "سائن اپ کریں اور اپنی پیش کردہ مہارتوں کی فہرست بنائیں۔ اعتماد پیدا کرنے کے لیے تصدیق کروائیں۔",
          "step2_title": "2. تلاش کریں اور تبادلہ کریں",
          "step2_description": "اپنی مطلوبہ مہارتیں براؤز کریں، یا درخواست پوسٹ کریں۔ تبادلے کا انتظام کرنے کے لیے دوسروں سے رابطہ کریں۔",
          "step3_title": "3. درجہ بندی کریں اور کمائیں",
          "step3_description": "تبادلہ مکمل کریں، رائے دیں، اور اپنے تعاون کے لیے اسکل پوائنٹس حاصل کریں۔",

          // Featured Skills Section (Urdu)
          "featured_skills_title": "نمایاں مہارتیں",
          "view_all_link": "تمام دیکھیں →",
          "view_details_link": "تفصیلات دیکھیں →",

          // Testimonials Section (Urdu)
          "testimonials_title": "ہماری کمیونٹی کیا کہتی ہے",
          "testimonial1_quote": "میں نے اپنے پڑوسی کے واٹر پمپ کو ٹھیک کیا، اور بدلے میں، ان کی بیوی نے میری بیٹی کو کڑھائی سکھائی۔ گڈ کام – اسکل سویپ نے یہ ممکن بنایا۔ یہ ہمارے گاؤں کے لیے ایک نعمت ہے۔",
          "testimonial1_author_name": "اقبال حسین",
          "testimonial1_author_details": "میکینک، پنجاب",
          "testimonial2_quote": "ایک عورت کے طور پر، کام تلاش کرنا ہمیشہ آسان نہیں ہوتا۔ خواتین کے لیے مخصوص زون کے ذریعے، مجھے اپنی سلائی کی مہارت پیش کرنے اور ایک اور عورت سے اکاؤنٹنگ سیکھنے کے لیے ایک محفوظ جگہ ملی۔",
          "testimonial2_author_name": "سمینہ اختر",
          "testimonial2_author_details": "ہوم شیف، سندھ",

          // Women's Zone Section (Urdu)
          "women_zone_title": "خواتین کے لیے ایک محفوظ جگہ",
          "women_zone_description": "ہماری خواتین کے لیے مخصوص اسکل زون خواتین کو اعتماد کے ساتھ جوڑنے، سیکھنے اور مہارتوں کا تبادلہ کرنے کے لیے ایک محفوظ اور معاون ماحول فراہم کرتا ہے۔",
          "women_zone_button": "خواتین کے زون کو دریافت کریں",

          // Footer (Urdu)
          "footer_tagline": "مہارتوں کو جوڑ کر، بغیر پیسوں کے، کمیونٹیز کو بااختیار بنانا۔",
          "footer_quick_links": "فوری لنکس",
          "footer_support": "سپورٹ",
          "footer_follow_us": "ہمیں فالو کریں",
          "footer_copyright": "گڈ کام – اسکل سویپ پاکستان۔ تمام حقوق محفوظ ہیں۔",
          "footer_privacy_policy": "پرائیویسی پالیسی",
          "footer_terms_of_service": "سروس کی شرائط",
          "Empowering_communities_by_connecting_skills_cash_free": "مہارتوں کو نقد کے بغیر جوڑ کر کمیونٹیز کو بااختیار بنانا۔",

          // Language names for display (Urdu)
          "lang_en": "انگریزی",
          "lang_ur": "اردو",
          "lang_sd": "سنڌي",

          // --- Dashboard Translations (Urdu) ---
          "dashboard_welcome_heading": "خوش آمدید، {{username}}!",
          "dashboard_sub_heading": "یہاں آپ کی اسکل سویپ سرگرمی کا ایک فوری جائزہ ہے۔",
          "skills_offered_title": "پیش کردہ مہارتیں",
          "skills_offered_detail": "شروع کرنے کے لیے ایک مہارت پوسٹ کریں!",
          "skills_received_title": "حاصل کردہ مہارتیں",
          "skills_received_detail": "آج ہی نئی چیزیں سیکھنا شروع کریں!",
          "unread_messages_title": "نہ پڑھے گئے پیغامات",
          "unread_messages_detail": "ابھی تک کوئی نیا پیغام نہیں ہے۔",
          "find_skill_title": "ایک مہارت تلاش کریں",
          "find_skill_description": "اپنی کمیونٹی میں نئی مہارتیں دریافت کرنے اور باصلاحیت لوگوں سے جڑنے کے لیے مارکیٹ پلیس کو دریافت کریں۔",
          "browse_marketplace_btn": "مارکیٹ پلیس براؤز کریں",
          "offer_skill_title_card": "ایک مہارت پیش کریں",
          "offer_skill_description_card": "اپنی مہارت کمیونٹی کے ساتھ شیئر کریں۔ ایک ایسی مہارت پوسٹ کریں جو آپ سکھا سکتے ہیں یا کوئی ایسی خدمت جو آپ فراہم کر سکتے ہیں۔",
          "post_new_skill_btn": "نئی مہارت پوسٹ کریں",

          // --- Profile Page Translations (Urdu) ---
          "profile_page_title": "میرا پروفائل",
          "profile_update_prompt": "اپنی تصویر اور ذاتی تفصیلات یہاں اپ ڈیٹ کریں۔",
          "change_picture_btn": "تصویر تبدیل کریں",
          "full_name_label": "پورا نام",
          "email_address_label": "ای میل ایڈریس",
          "phone_number_label": "فون نمبر",
          "location_label": "مقام",
          "about_me_label": "میرے بارے میں",
          "discard_changes_btn": "تبدیلیاں مسترد کریں",
          "save_changes_btn": "تبدیلیاں محفوظ کریں",

          // --- Offer Skill Page Translations (Urdu) ---
          "offer_skill_title": "ایک نئی مہارت پیش کریں",
          "offer_skill_subtitle": "اپنی مہارتیں شیئر کریں اور اپنی کمیونٹی میں دوسروں سے جڑیں!",
          "step1_offer_skill": "مرحلہ 1: آپ کیا پیش کر سکتے ہیں؟",
          "step1_offer_skill_desc": "اپنی مہارت کا اشتراک کریں اور کچھ نیا سیکھتے ہوئے دوسروں کی مدد کریں! نیچے دی گئی فہرست سے 3 تک مہارتیں منتخب کریں جن میں آپ پراعتماد ہیں، یا اپنی تلاش کریں۔",
          "step1_offer_skill_label": "آپ کون سی اعلیٰ مہارتیں دوسروں کو پیش کرنا چاہیں گے؟",
          "step1_offer_skill_placeholder": "پیش کرنے کے لیے مہارتیں تلاش کریں...",
          "step2_offer_skill": "مرحلہ 2: مزید تفصیلات شامل کریں",
          "step2_offer_skill_desc": "اپنی فہرست کو نمایاں کرنے کے لیے ایک اختیاری تصویر اور تفصیل شامل کریں۔ لوگوں کو آپ سے جڑنے میں مدد کے لیے اپنا مقام اور رابطے کی تفصیلات فراہم کریں۔",
          "step2_photo_label": "ایک تصویر اپ لوڈ کریں (اختیاری)",
          "step2_description_label": "تفصیل",
          "step2_description_placeholder": "آپ جو پیش کر رہے ہیں اس کی مزید تفصیل سے وضاحت کریں...",
          "step2_location_label": "مقام",
          "step2_location_placeholder": "مثلاً، لاہور، پاکستان",
          "step2_go_anonymous_switch": "گمنام رہیں",
          "step2_remotely_switch": "دور سے دستیاب",
          "step2_women_zone_switch": "خواتین کے لیے مخصوص زون میں شیئر کریں",
          "step3_offer_skill": "مرحلہ 3: بدلے میں آپ کیا چاہتے ہیں؟",
          "step3_offer_skill_desc": "ہمیں بتائیں کہ آپ کن مہارتوں کا تبادلہ کرنا چاہتے ہیں اور نئے مواقع دریافت کریں! فہرست سے 3 تک مہارتیں منتخب کریں جو آپ سیکھنا یا بہتر کرنا چاہتے ہیں۔",
          "step3_offer_skill_label": "آپ کن نئی مہارتوں کا تبادلہ کرنے کے لیے پرجوش ہیں؟",
          "step3_offer_skill_placeholder": "سیکھنے کے لیے مہارتیں تلاش کریں...",
          "step4_offer_skill": "مرحلہ 4: جائزہ لیں اور شائع کریں",
          "step4_offer_skill_desc": "براہ کرم نیچے دی گئی تمام تفصیلات کا جائزہ لیں۔ اگر سب کچھ ٹھیک ہے تو، اپنی پیشکش کو مارکیٹ پلیس پر شائع کریں۔",
          "step4_review_message": "تصدیق کرکے، آپ ہماری سروس کی شرائط اور رازداری کی پالیسی سے اتفاق کرتے ہیں۔",
          "step4_confirm_publish_btn": "تصدیق کریں اور شائع کریں",
          "go_back_btn": "واپس",
          "next_btn": "آگے",

          // --- My Skills Page Translations (Urdu) ---
          "my_skills_page_title": "میری پیش کردہ مہارتیں",
          "my_skills_page_subtitle": "اپنی فعال مہارت کی پیشکشوں کا انتظام کریں اور ان کی کارکردگی کو ٹریک کریں۔",
          "no_skills_offered": "آپ نے ابھی تک کوئی مہارت پیش نہیں کی ہے۔ شروع کرنے کے لیے ایک پوسٹ کریں!",
          "view_full_details_btn": "مکمل تفصیلات دیکھیں",
          "delete_offer_btn": "پیشکش حذف کریں",
          "offer_skill_label": "پیش کردہ مہارت",
          "swap_skill_label": "مطلوبہ مہارت",
          "description_label": "تفصیل",
          "skill_not_specified": "واضح نہیں کیا گیا",
          "yes": "ہاں",
          "no": "نہیں",

          // --- Marketplace Page Translations (Urdu) ---
          "marketplace_page_title": "مہارت مارکیٹ پلیس",
          "marketplace_page_subtitle": "اپنی کمیونٹی میں دوسروں کی طرف سے پیش کردہ مہارتیں دریافت کریں۔",
          "no_skills_available": "اس وقت مارکیٹ پلیس میں کوئی مہارت دستیاب نہیں ہے۔ بعد میں دوبارہ چیک کریں!",
          "request_btn": "درخواست",

          // --- Women Only Zone Page Translations (Urdu) ---
          "women_only_zone_page_title": "خواتین کے لیے مخصوص مہارت زون",
          "women_only_zone_page_subtitle": "خواتین کے لیے مہارتیں محفوظ طریقے سے شیئر کرنے اور تبادلہ کرنے کے لیے ایک مخصوص جگہ۔",
          "no_women_zone_skills_available": "اس وقت خواتین کے لیے مخصوص زون میں کوئی مہارت دستیاب نہیں ہے۔ بعد میں دوبارہ چیک کریں!",

          // --- Signup Page Translations (Urdu) ---
          "signup_join_gadd_kaam": "گڈ کام میں شامل ہوں",
          "signup_start_offering_finding": "اپنی کمیونٹی میں ہنر پیش کرنے اور تلاش کرنے کے لیے ایک اکاؤنٹ بنائیں۔",
          "signup_firstName_label": "پہلا نام",
          "signup_firstName_placeholder": "آپ کا پہلا نام",
          "signup_lastName_label": "آخری نام",
          "signup_lastName_placeholder": "آپ کا آخری نام",
          "signup_profilePicture_label": "پروفائل تصویر",
          "signup_no_file_chosen": "کوئی فائل منتخب نہیں کی گئی۔",
          "signup_username_label": "صارف نام",
          "signup_username_placeholder": "صارف نام منتخب کریں",
          "signup_phoneNumber_label": "فون نمبر",
          "signup_email_label": "ای میل",
          "signup_dateOfBirth_label": "تاریخ پیدائش",
          "signup_cnicNumber_label": "شناختی کارڈ نمبر",
          "signup_cnicFrontPic_label": "شناختی کارڈ سامنے کی تصویر",
          "signup_cnicBackPic_label": "شناختی کارڈ پیچھے کی تصویر",
          "signup_password_label": "پاس ورڈ",
          "signup_confirmPassword_label": "پاس ورڈ کی تصدیق کریں",
          "signup_create_account_btn": "اکاؤنٹ بنائیں",
          "signup_already_have_account": "پہلے سے ہی اکاؤنٹ ہے؟",
          "signup_login_link": "لاگ ان کریں",

          // Signup Form Errors (Urdu)
          "signup_error_firstName_required": "پہلا نام درکار ہے۔",
          "signup_error_lastName_required": "آخری نام درکار ہے۔",
          "signup_error_profilePic_required": "پروفائل تصویر درکار ہے۔",
          "signup_error_username_required": "صارف نام درکار ہے۔",
          "signup_error_phoneNumber_required": "فون نمبر درکار ہے۔",
          "signup_error_email_required": "ای میل درکار ہے۔",
          "signup_error_dob_required": "تاریخ پیدائش درکار ہے۔",
          "signup_error_cnic_invalid": "شناختی کارڈ نمبر 13 ہندسوں کا ہونا چاہیے۔",
          "signup_error_cnicFrontPic_required": "شناختی کارڈ سامنے کی تصویر درکار ہے۔",
          "signup_error_cnicBackPic_required": "شناختی کارڈ پیچھے کی تصویر درکار ہے۔",
          "signup_error_password_required": "پاس ورڈ درکار ہے۔",
          "signup_error_confirmPassword_required": "پاس ورڈ کی تصدیق درکار ہے۔",
          "signup_error_passwords_mismatch": "پاس ورڈ میل نہیں کھاتے۔",
          "signup_success_message": "اکاؤنٹ کامیابی سے بن گیا!"
        },
      },
      sd: {
        translation: {
          // General Utility (Sindhi)
          "dark_mode_toggle": "اونداهي موڊ کي تبديل ڪريو",
          "change_language": "ٻولي تبديل ڪريو",
          "call_helpline": "هلپ لائن تي ڪال ڪريو",

          // Navbar (Sindhi)
          "navbar_home": "گھر",
          "navbar_about_us": "اسان بابت",
          "navbar_women_zone": "خاتونن لاءِ مخصوص علائقو",
          "navbar_contact": "رابطو",
          "navbar_login_btn": "لاگ ان ٿيو",
          "navbar_signup_btn": "سائن اپ ٿيو",
          "navbar_logout": "لاگ آئوٽ",
          "navbar_dashboard": "ڊيش بورڊ",
          "navbar_my_profile": "منهنجو پروفائل",
          "navbar_my_skills": "منهنجيون صلاحيتون",
          "navbar_messages": "پيغام",
          "navbar_marketplace": "مارڪيٽ پليس",

          // Hero Section (Sindhi)
          "hero_headline": "مهارتن جو تبادلو، مستقبل جي تعمير.",
          "hero_subtext": "گڊ ڪام – اسڪل سوائيپ پاڪستان هڪ اهڙي ڪميونٽي آهي جتي توهان پنهنجي صلاحيتن کي گهربل مدد لاءِ مٽائي سگهو ٿا، بغير ڪنهن پئسي جي.",
          "hero_offer_skill_btn": "مهارت پيش ڪريو",
          "hero_find_skill_btn": "مهارت ڳوليو",
          "hero_title": "مقامي صلاحيتن سان ڳنڍيو",
          "hero_subtitle": "پاڪستان ۾ مقامي خدمتون ڳولڻ ۽ پيش ڪرڻ لاءِ توهان جو هڪ اسٽاپ منزل.",
          "hero_join_now": "هاڻي شامل ٿيو",
          "hero_find_service": "خدمت ڳوليو",
          "hero_find_service_desc": "پنهنجي علائقي ۾ ماهر پيشه ورن پاران پيش ڪيل خدمتن جي وسيع رينج کي براؤز ڪريو.",
          "hero_offer_skills": "پنهنجيون صلاحيتون پيش ڪريو",
          "hero_offer_skills_desc": "هڪ پروفائل ٺاهيو ۽ ڪميونٽي کي پنهنجيون خدمتون پيش ڪري ڪمائڻ شروع ڪريو.",
          "hero_secure_reliable": "محفوظ ۽ قابل اعتماد",
          "hero_secure_reliable_desc": "اسان سڀني ٽرانزيڪشن ۽ رابطن لاءِ هڪ محفوظ پليٽ فارم فراهم ڪندا آهيون.",

          // How It Works Section (Sindhi)
          "how_it_works_title": "اهو ڪيئن ڪم ڪري ٿو",
          "how_it_works_subtitle": "اسان جي ڪميونٽي ۾ شامل ٿيڻ آسان آهي. مهارتن جو تبادلو شروع ڪرڻ لاءِ هيٺين سادي قدمن تي عمل ڪريو.",
          "step1_title": "1. پروفائل ٺاهيو",
          "step1_description": "سائن اپ ڪريو ۽ پنهنجي پيش ڪيل مهارتن جي لسٽ ٺاهيو. اعتماد پيدا ڪرڻ لاءِ تصديق ڪرايو.",
          "step2_title": "2. ڳوليو ۽ تبادلو ڪريو",
          "step2_description": "توهان کي گهربل مهارتون براؤز ڪريو، يا درخواست پوسٽ ڪريو. تبادلي جو انتظام ڪرڻ لاءِ ٻين سان رابطو ڪريو.",
          "step3_title": "3. درجه بندي ڪريو ۽ ڪمايو",
          "step3_description": "تبادلو مڪمل ڪريو، راءِ ڏيو، ۽ پنهنجي تعاون لاءِ اسڪل پوائنٽس حاصل ڪريو.",

          // Featured Skills Section (Sindhi)
          "featured_skills_title": "نمايان مهارتون",
          "view_all_link": "سڀ ڏسو →",
          "view_details_link": "تفصيل ڏسو →",

          // Testimonials Section (Sindhi)
          "testimonials_title": "اسان جي ڪميونٽي ڇا چوي ٿي",
          "testimonial1_quote": "مون پنهنجي پاڙيسريءَ جو واٽر پمپ ٺيڪ ڪيو، ۽ ان جي بدلي ۾، سندس گهر واريءَ منهنجي ڌيءَ کي ڪڙهائي سکاري. گڊ ڪام – اسڪل سوائيپ اهو ممڪن ڪيو. اهو اسان جي ڳوٺ لاءِ هڪ نعمت آهي.",
          "testimonial1_author_name": "اقبال حسين",
          "testimonial1_author_details": "مڪينڪ، پنجاب",
          "testimonial2_quote": "هڪ عورت جي حيثيت سان، ڪم ڳولڻ هميشه آسان ناهي. عورتن لاءِ مخصوص علائقي ذريعي، مون کي پنهنجي سلائي جي مهارت پيش ڪرڻ ۽ هڪ ٻي عورت کان اڪائونٽنگ سکڻ لاءِ هڪ محفوظ جاءِ ملي.",
          "testimonial2_author_name": "ثمينا اختر",
          "testimonial2_author_details": "گھر جي رڌڻي، سنڌ",

          // Women's Zone Section (Sindhi)
          "women_zone_title": "خاتونن لاءِ هڪ محفوظ جاءِ",
          "women_zone_description": "اسان جو عورتن لاءِ مخصوص اسڪل زون عورتن کي اعتماد سان ڳنڍڻ، سکڻ ۽ مهارتن جو تبادلو ڪرڻ لاءِ هڪ محفوظ ۽ مددگار ماحول فراهم ڪري ٿو.",
          "women_zone_button": "خاتونن جي زون کي ڳوليو",

          // Footer (Sindhi)
          "footer_tagline": "مهارتن کي ڳنڍڻ، بغير نقد، جي ذريعي ڪميونٽين کي بااختيار بڻائڻ.",
          "footer_quick_links": "تڪڙا لنڪ",
          "footer_support": "مدد",
          "footer_follow_us": "اسان جي پيروي ڪريو",
          "footer_copyright": "گڊ ڪام – اسڪل سوائيپ پاڪستان. سڀ حق محفوظ.",
          "footer_privacy_policy": "پرائيويسي پاليسي",
          "footer_terms_of_service": "سروس جون شرطون",
          "Empowering_communities_by_connecting_skills_cash_free": "مهارتن کي ڳنڍڻ، بغير نقد، جي ذريعي ڪميونٽين کي بااختيار بڻائڻ.",

          // Language names for display (Sindhi)
          "lang_en": "انگريزي",
          "lang_ur": "اردو",
          "lang_sd": "سنڌي",

          // --- Dashboard Translations (Sindhi) ---
          "dashboard_welcome_heading": "ڀليڪار، {{username}}!",
          "dashboard_sub_heading": "هتي توهان جي اسڪل سوائيپ سرگرمي جو هڪ تڪڙو جائزو آهي.",
          "skills_offered_title": "پيش ڪيل صلاحيتون",
          "skills_offered_detail": "شروع ڪرڻ لاءِ هڪ مهارت پوسٽ ڪريو!",
          "skills_received_title": "حاصل ڪيل صلاحيتون",
          "skills_received_detail": "اڄ ئي نيون شيون سکڻ شروع ڪريو!",
          "unread_messages_title": "اڻ پڙهيل پيغام",
          "unread_messages_detail": "اڃا تائين ڪو نئون پيغام ناهي.",
          "find_skill_title": "هڪ مهارت ڳوليو",
          "find_skill_description": "پنهنجي ڪميونٽي ۾ نيون صلاحيتون دريافت ڪرڻ ۽ باصلاحيت ماڻهن سان ڳنڍڻ لاءِ مارڪيٽ پليس کي ڳوليو.",
          "browse_marketplace_btn": "مارڪيٽ پليس براؤز ڪريو",
          "offer_skill_title_card": "هڪ مهارت پيش ڪريو",
          "offer_skill_description_card": "پنهنجي ماهر کي ڪميونٽي سان شيئر ڪريو. هڪ مهارت پوسٽ ڪريو جيڪا توهان سيکاري سگهو ٿا يا هڪ خدمت جيڪا توهان فراهم ڪري سگهو ٿا.",
          "post_new_skill_btn": "نئين مهارت پوسٽ ڪريو",

          // --- Profile Page Translations (Sindhi) ---
          "profile_page_title": "منهنجو پروفائل",
          "profile_update_prompt": "پنهنجي تصوير ۽ ذاتي تفصيل هتي اپڊيٽ ڪريو.",
          "change_picture_btn": "تصوير تبديل ڪريو",
          "full_name_label": "پورو نالو",
          "email_address_label": "اي ميل پتو",
          "phone_number_label": "فون نمبر",
          "location_label": "جڳھ",
          "about_me_label": "منهنجي باري ۾",
          "discard_changes_btn": "تبديليون رد ڪريو",
          "save_changes_btn": "تبديليون محفوظ ڪريو",

          // --- Offer Skill Page Translations (Sindhi) ---
          "offer_skill_title": "هڪ نئين مهارت پيش ڪريو",
          "offer_skill_subtitle": "پنهنجيون صلاحيتون شيئر ڪريو ۽ پنهنجي ڪميونٽي ۾ ٻين سان ڳنڍيو!",
          "step1_offer_skill": "قدم 1: توهان ڇا پيش ڪري سگهو ٿا؟",
          "step1_offer_skill_desc": "پنهنجي ماهر کي شيئر ڪريو ۽ ڪجهه نئون سکڻ دوران ٻين جي مدد ڪريو! هيٺ ڏنل فهرست مان 3 تائين صلاحيتون چونڊيو جن ۾ توهان کي پورو اعتماد آهي، يا پنهنجي ڳوليو.",
          "step1_offer_skill_label": "ڪهڙيون اعليٰ صلاحيتون توهان ٻين کي پيش ڪرڻ چاهيندا؟",
          "step1_offer_skill_placeholder": "پيش ڪرڻ لاءِ صلاحيتون ڳوليو...",
          "step2_offer_skill": "قدم 2: وڌيڪ تفصيل شامل ڪريو",
          "step2_offer_skill_desc": "پنهنجي لسٽ کي نمايان ڪرڻ لاءِ هڪ اختياري تصوير ۽ تفصيل شامل ڪريو. ماڻهن کي توهان سان ڳنڍڻ ۾ مدد لاءِ پنهنجو مقام ۽ رابطي جي تفصيل فراهم ڪريو.",
          "step2_photo_label": "هڪ تصوير اپلوڊ ڪريو (اختياري)",
          "step2_description_label": "تفصيل",
          "step2_description_placeholder": "توهان جيڪو پيش ڪري رهيا آهيو ان جي وڌيڪ تفصيل سان وضاحت ڪريو...",
          "step2_location_label": "جڳھ",
          "step2_location_placeholder": "مثال طور، لاهور، پاڪستان",
          "step2_go_anonymous_switch": "گمنام رهو",
          "step2_remotely_switch": "دور کان دستياب",
          "step2_women_zone_switch": "عورتن لاءِ مخصوص علائقي ۾ شيئر ڪريو",
          "step3_offer_skill": "قدم 3: بدلي ۾ توهان ڇا چاهيو ٿا؟",
          "step3_offer_skill_desc": "اسان کي ٻڌايو ته توهان ڪهڙين صلاحيتن جو تبادلو ڪرڻ چاهيو ٿا ۽ نوان موقعا دريافت ڪريو! فهرست مان 3 تائين صلاحيتون چونڊيو جيڪي توهان سکڻ يا بهتر ڪرڻ چاهيو ٿا.",
          "step3_offer_skill_label": "ڪهڙيون نيون صلاحيتون توهان تبادلو ڪرڻ لاءِ پرجوش آهيو؟",
          "step3_offer_skill_placeholder": "سکڻ لاءِ صلاحيتون ڳوليو...",
          "step4_offer_skill": "قدم 4: جائزو وٺو ۽ شايع ڪريو",
          "step4_offer_skill_desc": "مهرباني ڪري هيٺ ڏنل سڀني تفصيلن جو جائزو وٺو. جيڪڏهن سڀ ڪجهه ٺيڪ آهي، پنهنجي پيشڪش کي مارڪيٽ پليس تي شايع ڪريو.",
          "step4_review_message": "تصديق ڪري، توهان اسان جي سروس جي شرطن ۽ رازداري پاليسي سان متفق آهيو.",
          "step4_confirm_publish_btn": "تصديق ڪريو ۽ شايع ڪريو",
          "go_back_btn": "واپس",
          "next_btn": "اڳيون",

          // --- My Skills Page Translations (Sindhi) ---
          "my_skills_page_title": "منهنجيون پيش ڪيل صلاحيتون",
          "my_skills_page_subtitle": "پنهنجي فعال مهارت جي پيشڪش جو انتظام ڪريو ۽ انهن جي ڪارڪردگي کي ٽريڪ ڪريو.",
          "no_skills_offered": "توهان اڃا تائين ڪا به مهارت پيش نه ڪئي آهي. شروع ڪرڻ لاءِ هڪ پوسٽ ڪريو!",
          "view_full_details_btn": "مڪمل تفصيل ڏسو",
          "delete_offer_btn": "پيشڪش حذف ڪريو",
          "offer_skill_label": "پيش ڪيل مهارت",
          "swap_skill_label": "گهربل مهارت",
          "description_label": "تفصيل",
          "skill_not_specified": "واضح نه ڪيل",
          "yes": "ها",
          "no": "نه",

          // --- Marketplace Page Translations (Sindhi) ---
          "marketplace_page_title": "مهارت مارڪيٽ پليس",
          "marketplace_page_subtitle": "پنهنجي ڪميونٽي ۾ ٻين پاران پيش ڪيل صلاحيتون ڳوليو.",
          "no_skills_available": "هن وقت مارڪيٽ پليس ۾ ڪا به مهارت دستياب ناهي. بعد ۾ ٻيهر چيڪ ڪريو!",
          "request_btn": "درخواست",

          // --- Women Only Zone Page Translations (Sindhi) ---
          "women_only_zone_page_title": "خاتونن لاءِ مخصوص اسڪل زون",
          "women_only_zone_page_subtitle": "عورتن لاءِ هڪ وقف ٿيل جاءِ جتي هو محفوظ طور تي صلاحيتون شيئر ۽ تبادلو ڪري سگهن ٿيون.",
          "no_women_zone_skills_available": "هن وقت خاتونن لاءِ مخصوص زون ۾ ڪا به مهارت دستياب ناهي. بعد ۾ ٻيهر چيڪ ڪريو!",

          // --- Signup Page Translations (Sindhi) ---
          "signup_join_gadd_kaam": "گڊ ڪام ۾ شامل ٿيو",
          "signup_start_offering_finding": "توهان جي ڪميونٽي ۾ مهارتون پيش ڪرڻ ۽ ڳولڻ شروع ڪرڻ لاءِ هڪ اڪائونٽ ٺاهيو.",
          "signup_firstName_label": "پهريون نالو",
          "signup_firstName_placeholder": "توهان جو پهريون نالو",
          "signup_lastName_label": "آخري نالو",
          "signup_lastName_placeholder": "توهان جو آخري نالو",
          "signup_profilePicture_label": "پروفائل تصوير",
          "signup_no_file_chosen": "ڪابه فائل چونڊيل ناهي.",
          "signup_username_label": "يوزر نالو",
          "signup_username_placeholder": "هڪ يوزر نالو چونڊيو",
          "signup_phoneNumber_label": "فون نمبر",
          "signup_email_label": "اي ميل",
          "signup_dateOfBirth_label": "ڄمڻ جي تاريخ",
          "signup_cnicNumber_label": "سي اين آءِ سي نمبر",
          "signup_cnicFrontPic_label": "سي اين آءِ سي سامهون جي تصوير",
          "signup_cnicBackPic_label": "سي اين آءِ سي پٺيان جي تصوير",
          "signup_password_label": "پاسورڊ",
          "signup_confirmPassword_label": "پاسورڊ جي تصديق ڪريو",
          "signup_create_account_btn": "اڪائونٽ ٺاهيو",
          "signup_already_have_account": "اڳ ۾ ئي اڪائونٽ آهي؟",
          "signup_login_link": "لاگ ان ٿيو",

          // Signup Form Errors (Sindhi)
          "signup_error_firstName_required": "پهريون نالو لازمي آهي.",
          "signup_error_lastName_required": "آخري نالو لازمي آهي.",
          "signup_error_profilePic_required": "پروفائل تصوير لازمي آهي.",
          "signup_error_username_required": "يوزر نالو لازمي آهي.",
          "signup_error_phoneNumber_required": "فون نمبر لازمي آهي.",
          "signup_error_email_required": "اي ميل لازمي آهي.",
          "signup_error_dob_required": "ڄمڻ جي تاريخ لازمي آهي.",
          "signup_error_cnic_invalid": "سي اين آءِ سي نمبر 13 عددن جو هجڻ گهرجي.",
          "signup_error_cnicFrontPic_required": "سي اين آءِ سي سامهون جي تصوير لازمي آهي.",
          "signup_error_cnicBackPic_required": "سي اين آءِ سي پٺيان جي تصوير لازمي آهي.",
          "signup_error_password_required": "پاسورڊ لازمي آهي.",
          "signup_error_confirmPassword_required": "پاسورڊ جي تصديق لازمي آهي.",
          "signup_error_passwords_mismatch": "پاسورڊ هڪجهڙا ناهن.",
          "signup_success_message": "اڪائونٽ ڪاميابي سان ٺاهيو ويو!"
        },
      },
    },
  });

export default i18n;
