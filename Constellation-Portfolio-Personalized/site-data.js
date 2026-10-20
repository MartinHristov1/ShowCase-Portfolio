/*
 * PORTFOLIO CONTENT — EDIT THIS FILE TO PERSONALISE YOUR WEBSITE.
 *
 * 1. Update profile.email, social links, and optional photo/CV paths.
 * 2. Edit, remove, or add projects in the projects array.
 * 3. Replace project cover images in /assets, or change each cover path.
 * 4. Case study pages are generated automatically from project entries.
 *
 * Do not publish with details or case studies you have not verified.
 */
window.PORTFOLIO_DATA = {
  profile: {
    name: "Martin Hristov",
    logo: "MH.",
    role: "UI/UX Designer & Creative Developer",
    greeting: "Hey, I'm Martin 👋",
    headlineStart: "Making complex",
    headlineAccent: "feel simple",
    headlineEnd: "and human.",
    intro: "I’m Martin, an ICT & Media Design student at Fontys with a passion for UI/UX, visual design and front-end development. I love turning ideas into digital experiences that feel intuitive, useful and a little unexpected.",
    shortBio: "I combine creative thinking, user research and front-end development to build thoughtful experiences. I like exploring ideas, trying things out and improving them through feedback.",
    about: [
      "I'm a UI/UX-focused ICT & Media Design student at Fontys University of Applied Sciences in Eindhoven, the Netherlands. Originally from Bulgaria, I enjoy exploring how design and technology come together to solve everyday problems.",
      "During my UI/UX internship at Digital Planet LTD, I worked on a Virtual Classroom concept, from understanding student needs to prototyping and usability testing. I also enjoy building interactive front-end projects and mobile app concepts.",
      "I'm currently looking for a graduation internship where I can contribute to a real product, collaborate with a team, and continue growing as a designer and developer."
    ],
    location: "Eindhoven, Netherlands",
    microNote: "From Bulgaria / Designing in Eindhoven / Always curious.",
    availability: "Open to graduation internships",
    email: "martinhristov174@gmail.com",
    linkedin: "https://www.linkedin.com/in/martinhristov12/",
    github: "",                // Add your GitHub link later if you recover it
    resume: "assets/Martin-Hristov-CV.pdf",
    photo: "assets/martin-portrait.webp"
  },
  // The badges below reflect skills and tools mentioned in my CV and projects.
  coreTechnologies: ["HTML", "CSS", "JavaScript", "SwiftUI", "Figma", "Adobe Creative Suite"],
  skills: [
    { title: "UX Research", items: ["User interviews", "User requirements", "Competitor analysis", "Usability testing"] },
    { title: "UI & Visual Design", items: ["Figma", "Wireframes", "Interactive prototypes", "Responsive UI"] },
    { title: "Development", items: ["HTML", "CSS", "JavaScript", "SwiftUI", "API integration"] },
    { title: "Collaboration", items: ["Human-centred design", "Iteration", "Stakeholder feedback", "Communication"] }
  ],
  experience: [
    {
      organisation: "Digital Planet LTD",
      role: "UI/UX Design Intern",
      period: "Feb — Jun 2026 · Remote",
      description: "Researched, designed, prototyped, and tested a Virtual Classroom concept for students and teachers, using feedback to guide design iterations."
    },
    {
      organisation: "Fontys University of Applied Sciences",
      role: "ICT & Media Design Student",
      period: "Eindhoven, Netherlands",
      description: "Exploring design, research, prototyping, front-end development, and human-centred problem solving through multidisciplinary projects."
    }
  ],
  projects: [
    {
      slug: "virtual-classroom",
      title: "Virtual Classroom",
      category: "UI/UX Design",
      type: "Internship project",
      year: "2026",
      cover: "assets/virtual-classroom-cover.webp",
      featured: true,
      video: "assets/virtual-classroom-highlights.mp4",
      videoPoster: "assets/virtual-classroom-cover.webp",
      videoLabel: "20-second highlight reel captured from my original Virtual Classroom prototype recording",
      summary: "A more intuitive online classroom experience focused on engagement, communication, and accessibility.",
      role: "UI/UX Research & Design",
      tools: ["Figma", "User interviews", "Usability testing", "DOT Framework"],
      overview: "Created during my internship at Digital Planet LTD, this project explores how an online classroom can support students and teachers without making the experience unnecessarily complicated.",
      challenge: "Online learning environments bring classes, communication, assignments, and learning resources into one space. The challenge was to keep those activities understandable and easy to navigate.",
      process: [
        { step: "01 / Discover", detail: "Studied existing virtual meeting and classroom platforms and explored student preferences through research and interviews." },
        { step: "02 / Design", detail: "Developed sketches and progressively refined Figma prototypes for classroom controls, participants, assignments, and resources." },
        { step: "03 / Validate", detail: "Ran student usability sessions and incorporated feedback about icon clarity, readable text, navigation, and assignment states." }
      ],
      outcome: "An iterated interactive prototype that brings classroom tools, participant visibility, assignments, and resources into a more coherent interface.",
      link: "",                 // Optional: live project/Figma/case-study URL
      gallery: ["assets/classroom-overview.webp", "assets/classroom-chat.webp", "assets/classroom-assignments.webp", "assets/classroom-resources.webp", "assets/classroom-resource-details.webp", "assets/classroom-connection.webp", "assets/classroom-settings.webp"]               // Optional: ["assets/classroom-detail-1.png", "assets/classroom-detail-2.png"]
    },
    {
      slug: "aquatrack",
      title: "AquaTrack",
      category: "UI/UX Design",
      type: "Student project · PWA concept",
      year: "2025",
      cover: "",
      featured: true,
      summary: "A friendly hydration-tracking experience designed for different ages and daily routines.",
      role: "Research & Product Design",
      tools: ["Human-centred design", "Interviews", "Prototyping", "PWA"],
      overview: "AquaTrack explores a simple way to help people keep track of their hydration with a flexible, approachable interface.",
      challenge: "Hydration needs and habits differ across age groups. A useful tracker should be understandable, easy to customise, and effortless to use throughout the day.",
      process: [
        { step: "01 / Understand", detail: "Explored different user groups, their habits, and possible accessibility considerations." },
        { step: "02 / Structure", detail: "Mapped ideas for profiles, reminders, intake units, and common container sizes." },
        { step: "03 / Prototype", detail: "Worked on an approachable progressive web app concept focused on easy daily interactions." }
      ],
      outcome: "A hydration product concept with adjustable measurements, reusable container options, and reminder-focused interactions.",
      link: "",
      gallery: []
    },
    {
      slug: "plantatree",
      title: "PlantaTree",
      category: "Mobile App",
      type: "iOS app concept",
      year: "2025",
      cover: "",
      featured: true,
      summary: "An iOS tree-exploration app with clear categories and approachable browsing.",
      role: "UI Design & Development",
      tools: ["SwiftUI", "iOS", "Navigation", "Prototyping"],
      overview: "PlantaTree is an iOS app concept for discovering different types of trees through visual categories and easy-to-browse detail views.",
      challenge: "Information about plants can quickly feel overwhelming. The goal was to make browsing and exploring tree types feel straightforward.",
      process: [
        { step: "01 / Organise", detail: "Structured tree content into accessible browsing categories such as fruit, big, and small trees." },
        { step: "02 / Build", detail: "Created a SwiftUI interface with horizontally scrolling content and navigation to detail views." },
        { step: "03 / Refine", detail: "Iterated on spacing, scroll behaviour, and navigation interactions." }
      ],
      outcome: "A SwiftUI-based app interface with category-led browsing, tree cards, and detail navigation.",
      link: "",
      gallery: []
    },
    {
      slug: "public-transport",
      title: "Public Transport App",
      category: "UI/UX Design",
      type: "App prototype",
      year: "2025",
      cover: "",
      featured: true,
      summary: "Simplifying bus schedules and navigation in a mobile-first transport concept.",
      role: "UX Research & Prototyping",
      tools: ["Figma", "User testing", "Information architecture", "Mobile UI"],
      overview: "A student project focused on making bus schedule information easier to find and understand on mobile devices.",
      challenge: "Transport information often needs to be understood quickly. The design needed to prioritise useful times and clear navigation.",
      process: [
        { step: "01 / Focus", detail: "Narrowed the concept to bus travel so the experience could stay understandable." },
        { step: "02 / Design", detail: "Explored schedule and settings screens, with clear bottom navigation." },
        { step: "03 / Test", detail: "Gathered user feedback and refined the prototype based on what was unclear." }
      ],
      outcome: "A bus-focused mobile prototype featuring a schedule screen, settings, and consistent navigation.",
      link: "",
      gallery: []
    },
    {
      slug: "pokemon-explorer",
      title: "Pokémon Explorer",
      category: "Development",
      type: "Front-end web app",
      year: "2025",
      cover: "",
      featured: true,
      summary: "A playful Pokémon API experiment that turns live data into interactive cards.",
      role: "Front-end Development",
      tools: ["JavaScript", "HTML", "CSS", "REST API"],
      overview: "A front-end project that uses the Pokémon API to retrieve creature information and display it in a visual card interface.",
      challenge: "API responses contain a lot of structured information. The task was to turn it into a readable, visually interesting interface.",
      process: [
        { step: "01 / Connect", detail: "Fetched random entries from the public API and selected relevant information." },
        { step: "02 / Visualise", detail: "Designed dynamic cards with details including type, HP, and weight." },
        { step: "03 / Refine", detail: "Expanded the interface to multiple cards and introduced type-based colour styling." }
      ],
      outcome: "An interactive front-end experiment that displays API data through reusable, dynamically styled cards.",
      link: "",
      gallery: []
    },
    {
      slug: "virtual-library",
      title: "Virtual Library",
      category: "Development",
      type: "Web application",
      year: "2025",
      cover: "",
      featured: true,
      summary: "A small library manager built around simple search and collection management.",
      role: "Front-end Development",
      tools: ["JavaScript", "HTML", "CSS", "localStorage"],
      overview: "A browser-based library concept where users can manage a collection of book entries.",
      challenge: "A simple content-management tool should make editing and finding entries feel predictable and organised.",
      process: [
        { step: "01 / Structure", detail: "Planned the collection view and actions for adding, viewing, editing, and deleting entries." },
        { step: "02 / Implement", detail: "Built the interface in HTML, CSS, and JavaScript with browser localStorage." },
        { step: "03 / Polish", detail: "Added search and adjusted interactions to prevent duplicate entries." }
      ],
      outcome: "A functional client-side CRUD interface with search and persistent local browser storage.",
      link: "",
      gallery: []
    }
  ]
};
