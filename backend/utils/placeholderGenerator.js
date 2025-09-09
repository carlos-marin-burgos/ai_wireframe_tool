/**
 * Intelligent Placeholder Text Generator
 * Generates contextual, varied placeholder content for wireframes
 */

class PlaceholderGenerator {
  constructor() {
    // Sample data pools for different contexts
    this.dataPools = {
      // User names from different backgrounds
      users: [
        "Sarah Chen",
        "Michael Rodriguez",
        "Emma Thompson",
        "David Kim",
        "Priya Patel",
        "Ahmed Hassan",
        "Lisa Johnson",
        "Carlos Martinez",
        "Jennifer Lee",
        "Robert Wilson",
        "Maria Garcia",
        "James Brown",
        "Anna Kowalski",
        "Samuel Taylor",
        "Rachel Green",
        "Alex Foster",
      ],

      // Learning and technology-focused actions
      learningActions: [
        "completed Azure Fundamentals certification",
        "started Machine Learning path",
        "earned Data Science badge",
        "finished JavaScript basics",
        "passed AI Engineer exam",
        "completed Python course",
        "started DevOps learning path",
        "earned Cloud Architecture certification",
        "finished React development module",
        "completed Cybersecurity fundamentals",
        "started AWS Solutions Architect path",
        "earned Database Design certificate",
      ],

      // Professional course/module titles
      courseTitles: [
        "Azure Cloud Fundamentals",
        "Advanced Machine Learning",
        "Full-Stack Web Development",
        "Data Science with Python",
        "Cybersecurity Essentials",
        "DevOps and CI/CD",
        "Mobile App Development",
        "AI and Natural Language Processing",
        "Cloud Architecture Design",
        "Database Management Systems",
        "Blockchain Technology",
        "Internet of Things (IoT)",
      ],

      // Business/organizational contexts
      companies: [
        "Microsoft",
        "TechCorp",
        "InnovateLabs",
        "CloudWorks",
        "DataStream Inc",
        "NextGen Solutions",
        "GlobalTech",
        "SmartSystems",
        "FutureBridge",
        "TechHaven",
        "DigitalEdge",
        "CloudFirst Labs",
      ],

      // Technology metrics and KPIs
      metrics: {
        users: [1247, 2891, 3456, 5632, 8924, 12567, 15890, 23456],
        percentages: [67, 72, 78, 83, 89, 92, 95, 98],
        growth: ["+12%", "+8%", "+15%", "+22%", "+5%", "+18%", "+11%", "+25%"],
        timeframes: [
          "last month",
          "this quarter",
          "last week",
          "this year",
          "last 30 days",
        ],
      },

      // Professional status indicators
      statuses: [
        { text: "In Progress", type: "progress" },
        { text: "Completed", type: "success" },
        { text: "Not Started", type: "pending" },
        { text: "Under Review", type: "review" },
        { text: "Approved", type: "success" },
        { text: "Scheduled", type: "scheduled" },
      ],

      // Time expressions
      timeExpressions: [
        "2 minutes ago",
        "15 minutes ago",
        "1 hour ago",
        "3 hours ago",
        "Today",
        "Yesterday",
        "2 days ago",
        "Last week",
        "Last month",
        "Just now",
        "5 minutes ago",
        "30 minutes ago",
        "This morning",
      ],
    };
  }

  /**
   * Get random item from an array
   */
  getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Generate user activity data
   */
  generateUserActivity(count = 3) {
    const activities = [];
    const usedUsers = new Set();

    for (let i = 0; i < count; i++) {
      let user;
      // Try to get unique users, but allow repeats if we run out
      do {
        user = this.getRandomItem(this.dataPools.users);
      } while (
        usedUsers.has(user) &&
        usedUsers.size < this.dataPools.users.length
      );

      usedUsers.add(user);

      activities.push({
        user,
        action: this.getRandomItem(this.dataPools.learningActions),
        time: this.getRandomItem(this.dataPools.timeExpressions),
        type:
          Math.random() > 0.3
            ? "success"
            : Math.random() > 0.5
            ? "info"
            : "achievement",
      });
    }

    return activities;
  }

  /**
   * Generate dashboard metrics
   */
  generateDashboardMetrics() {
    return {
      totalUsers: {
        value: this.getRandomItem(
          this.dataPools.metrics.users
        ).toLocaleString(),
        trend: this.getRandomItem(this.dataPools.metrics.growth),
        trendDirection: "up",
      },
      activeSessions: {
        value: Math.floor(
          this.getRandomItem(this.dataPools.metrics.users) * 0.6
        ).toLocaleString(),
        trend: "Currently online",
        trendDirection: "neutral",
      },
      completionRate: {
        value: `${this.getRandomItem(this.dataPools.metrics.percentages)}%`,
        trend: this.getRandomItem(this.dataPools.metrics.growth),
        trendDirection: "up",
      },
      performance: {
        value: `${this.getRandomItem(this.dataPools.metrics.percentages)}%`,
        trend: `${this.getRandomItem(
          this.dataPools.metrics.growth
        )} ${this.getRandomItem(this.dataPools.metrics.timeframes)}`,
        trendDirection: Math.random() > 0.7 ? "down" : "up",
      },
    };
  }

  /**
   * Generate table data for courses/learning content
   */
  generateCourseTableData(rowCount = 5) {
    const rows = [];
    const usedTitles = new Set();

    for (let i = 0; i < rowCount; i++) {
      let title;
      do {
        title = this.getRandomItem(this.dataPools.courseTitles);
      } while (
        usedTitles.has(title) &&
        usedTitles.size < this.dataPools.courseTitles.length
      );

      usedTitles.add(title);

      const status = this.getRandomItem(this.dataPools.statuses);
      const progress =
        status.type === "success"
          ? "100%"
          : status.type === "pending"
          ? "0%"
          : `${this.getRandomItem(this.dataPools.metrics.percentages)}%`;

      rows.push([
        title,
        status.text,
        progress,
        this.getRandomItem(this.dataPools.timeExpressions),
      ]);
    }

    return rows;
  }

  /**
   * Generate contextual placeholder text based on content type
   */
  generateContextualText(context, options = {}) {
    switch (context) {
      case "dashboard-title":
        return (
          options.title ||
          `${this.getRandomItem(this.dataPools.companies)} Learning Dashboard`
        );

      case "metric-cards":
        return this.generateDashboardMetrics();

      case "activity-feed":
        return this.generateUserActivity(options.count || 3);

      case "course-table":
        return {
          headers: ["Course Title", "Status", "Progress", "Last Updated"],
          rows: this.generateCourseTableData(options.rowCount || 5),
        };

      case "page-description":
        const topics = [
          "cloud computing",
          "machine learning",
          "web development",
          "data science",
          "cybersecurity",
        ];
        const topic = this.getRandomItem(topics);
        return `Explore comprehensive ${topic} courses and certifications designed for professionals seeking to advance their technical expertise.`;

      case "hero-subtitle":
        return "Master cutting-edge technologies with hands-on learning experiences and industry-recognized certifications.";

      case "card-content":
        return `Dive deep into practical ${this.getRandomItem([
          "Azure",
          "JavaScript",
          "Python",
          "React",
          "AI",
        ])} development with real-world projects and expert guidance.`;

      default:
        return "Contextual placeholder content";
    }
  }

  /**
   * Generate varied lorem-style text (when generic text is needed)
   */
  generateVariedText(type = "paragraph", length = "medium") {
    const techTerms = [
      "cloud computing",
      "machine learning",
      "artificial intelligence",
      "data analytics",
      "cybersecurity",
      "DevOps",
      "microservices",
      "containerization",
      "serverless",
      "API development",
    ];

    const actions = [
      "implement",
      "design",
      "develop",
      "optimize",
      "secure",
      "deploy",
      "monitor",
      "scale",
      "integrate",
      "automate",
    ];

    const outcomes = [
      "robust solutions",
      "scalable applications",
      "secure systems",
      "efficient workflows",
      "innovative products",
      "reliable infrastructure",
    ];

    switch (type) {
      case "short":
        return `Learn to ${this.getRandomItem(actions)} ${this.getRandomItem(
          techTerms
        )} for ${this.getRandomItem(outcomes)}.`;

      case "medium":
        return `Discover how to ${this.getRandomItem(
          actions
        )} modern ${this.getRandomItem(
          techTerms
        )} solutions. This comprehensive course covers best practices, industry standards, and hands-on techniques for building ${this.getRandomItem(
          outcomes
        )}.`;

      case "long":
        return `Master the art of ${this.getRandomItem(
          actions
        )}ing enterprise-grade ${this.getRandomItem(
          techTerms
        )} solutions. Through practical exercises and real-world scenarios, you'll gain expertise in creating ${this.getRandomItem(
          outcomes
        )} that meet industry demands. This course combines theoretical knowledge with hands-on experience to prepare you for professional success.`;

      default:
        return this.generateVariedText("medium");
    }
  }
}

module.exports = PlaceholderGenerator;
