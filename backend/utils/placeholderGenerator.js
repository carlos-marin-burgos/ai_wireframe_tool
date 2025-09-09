/**
 * Placeholder Generator Utility
 * Provides placeholder data and components for wireframe generation
 */

const generatePlaceholderText = (length = 100) => {
  const words = [
    "Lorem",
    "ipsum",
    "dolor",
    "sit",
    "amet",
    "consectetur",
    "adipiscing",
    "elit",
    "sed",
    "do",
    "eiusmod",
    "tempor",
    "incididunt",
    "ut",
    "labore",
    "et",
    "dolore",
    "magna",
    "aliqua",
    "enim",
    "ad",
    "minim",
    "veniam",
    "quis",
    "nostrud",
  ];

  let text = "";
  while (text.length < length) {
    text += words[Math.floor(Math.random() * words.length)] + " ";
  }

  return text.substring(0, length).trim();
};

const generatePlaceholderImage = (width = 300, height = 200) => {
  return `https://via.placeholder.com/${width}x${height}/007ACC/FFFFFF?text=Placeholder`;
};

const generatePlaceholderData = {
  button: {
    text: "Click Here",
    variant: "primary",
  },
  textField: {
    placeholder: "Enter text here",
    label: "Input Field",
  },
  card: {
    title: "Card Title",
    content: generatePlaceholderText(50),
    image: generatePlaceholderImage(),
  },
  navigation: {
    items: ["Home", "About", "Services", "Contact"],
    brand: "Company Name",
  },
  table: {
    headers: ["Name", "Email", "Role", "Status"],
    rows: [
      ["John Doe", "john@example.com", "Admin", "Active"],
      ["Jane Smith", "jane@example.com", "User", "Active"],
      ["Bob Johnson", "bob@example.com", "Editor", "Inactive"],
    ],
  },
};

class PlaceholderGenerator {
  generatePlaceholderText(length = 100) {
    const words = [
      "Lorem",
      "ipsum",
      "dolor",
      "sit",
      "amet",
      "consectetur",
      "adipiscing",
      "elit",
      "sed",
      "do",
      "eiusmod",
      "tempor",
      "incididunt",
      "ut",
      "labore",
      "et",
      "dolore",
      "magna",
      "aliqua",
      "enim",
      "ad",
      "minim",
      "veniam",
      "quis",
      "nostrud",
    ];

    let text = "";
    while (text.length < length) {
      text += words[Math.floor(Math.random() * words.length)] + " ";
    }

    return text.substring(0, length).trim();
  }

  generatePlaceholderImage(width = 300, height = 200) {
    return `https://via.placeholder.com/${width}x${height}/007ACC/FFFFFF?text=Placeholder`;
  }

  get generatePlaceholderData() {
    return {
      button: {
        text: "Click Here",
        variant: "primary",
      },
      textField: {
        placeholder: "Enter text here",
        label: "Input Field",
      },
      card: {
        title: "Card Title",
        content: this.generatePlaceholderText(50),
        image: this.generatePlaceholderImage(),
      },
      navigation: {
        items: ["Home", "About", "Services", "Contact"],
        brand: "Company Name",
      },
      table: {
        headers: ["Name", "Email", "Role", "Status"],
        rows: [
          ["John Doe", "john@example.com", "Admin", "Active"],
          ["Jane Smith", "jane@example.com", "User", "Active"],
          ["Bob Johnson", "bob@example.com", "Editor", "Inactive"],
        ],
      },
    };
  }
}

module.exports = PlaceholderGenerator;
