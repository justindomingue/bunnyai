import { Message } from "ai/react"

export const fake_messages = [
    {
        "id": "seed",
        "content": "you are a consumer application created by some of the top engineers and designers in the world. your output is factual, engaging, fun, and entertaining to read. it's concise, but keeps the reader hooked. I want you to give me a list of things that could be \"headlines\" for a UI with a bunch of cards on it. each card is a topic that would be interesting to the average person, and make them go \"huh, that's interesting\" and want to know more about the topic. these could be about pretty much anything, as long as they are factually and historically accurate and don't talk about any topics that would be considered controversial, or for which the science is not settled. don't use any topics that you aren't completely sure about. but these topics should each connect to something that anyone who's a little bit curious would want to know more about. and then when a user taps on one of the cards, I'm going to ask you to give a high level summary of the topic. and then the user will be prompted with one of two options: \"Go deeper\" which will make you generate more information about the topic until you feel the topic has been covered thoroughly enough that the reader would say they had learned something new, or \"Go weirder\" which would find some variant of the topic that's semi-relevant but changes things up\n\nagain, these topics should all be factual, but interesting. they can be about anything related to history, modern life, science, fun facts, trivia, or anything like those topics. and every \"chunk\" you share after a follow-up should end with a hook, or something that makes the reader want to learn more\n\nand assume that the only user input to follow up with will be one of the two choices: Go deeper, Go weirder, OR the user can always go back and select one from the initial list\n\nevery time you give any text, your response should be no longer than 3 short sentences. you can use emojis but use them sparingly and only when they really add to the text\n\nI want you to give me 12 initial topics, in the format of a very concise headline / card title, and a very brief subtitle that hooks the reader to want to know moree",
        "role": "user"
    },
    {
        "id": "fYqwSrk",
        "createdAt": "2023-09-24T04:26:09.120Z",
        "content": "1. \"The Mystery of the Bermuda Triangle: Unexplained Disappearances at Sea\" - Discover the secrets behind the infamous region where numerous ships and planes have vanished, leaving behind unanswered questions and intriguing theories.\n\n2. \"The Hidden Language of Body Gestures: Uncover the Meaning of Nonverbal Communication\" - Explore the fascinating world of nonverbal cues and learn how a simple gesture or expression can convey emotions and intentions across different cultures.\n\n3. \"The Science behind Dreams: Unlocking the Mysteries of Your Sleeping Mind\" - Delve into the enigmatic realm of dreams and uncover the latest scientific understanding of why we dream, the purpose they serve, and how they can influence our waking lives.\n\n4. \"The Surprising Origins of Everyday Phrases: Unraveling the Linguistic Stories\" - Unearth the captivating origins and historical narratives hiding behind commonly used phrases and idioms, shedding light on their peculiar beginnings.\n\n5. \"The Curious Case of the Pharaoh Tutankhamun: A Journey through Ancient Egypt\" - Embark on an archaeological adventure and unravel the story of the boy king Tutankhamun, his extravagant burial treasures, and the remarkable insights they provide into ancient Egyptian history.\n\n6. \"The Wonders of the Great Barrier Reef: Exploring Earth's Largest Living Structure\" - Dive into the vibrant and diverse ecosystem of the Great Barrier Reef, home to an astonishing array of marine life and an internationally renowned natural wonder.\n\n7. \"The Captivating Art of Origami: Folding Paper into Astonishing Creations\" - Uncover the artistry and precision behind the ancient Japanese practice of origami, where a simple sheet of paper can be transformed into intricate and awe-inspiring designs.\n\n8. \"The Intriguing History of Chocolate: From Sacred Drink to Global Sensation\" - Indulge in the delicious history of chocolate, tracing its ancient beginnings as a ceremonial beverage in Mesoamerica to its modern culinary prominence worldwide.\n\n9. \"The Science of Laughter: Unraveling the Mechanics and Benefits of Humor\" - Laugh your way through the scientific exploration of laughter, including its evolutionary significance, impact on our well-being, and the power of a good joke.\n\n10. \"The Fascinating World of Chess: A Game of Strategy and Intellectual Warfare\" - Step onto the chequered battlefield of chess and immerse yourself in the intricate tactics, rich history, and enduring appeal of the world's most beloved board game.\n\n11. \"The Renaissance Masters: Unveiling the Legends behind the World's Greatest Artworks\" - Discover the exceptional brilliance and revolutionary",
        "role": "assistant"
    },
    {
        "id": "1",
        "content": "go deeper",
        "role": "user"
    },
    {
        "id": "qCMu47D",
        "createdAt": "2023-09-24T04:26:42.204Z",
        "content": "Certainly! Let's delve deeper into \"The Renaissance Masters: Unveiling the Legends behind the World's Greatest Artworks.\"\n\nDuring the Renaissance, a remarkable group of artists emerged, leaving an indelible mark on the world of art. Leonardo da Vinci, Michelangelo, and Raphael are just a few of the renowned masters whose groundbreaking creations continue to inspire awe and admiration. Through their revolutionary techniques, innovative use of perspective, and profound exploration of human emotions, these artists transformed the artistic landscape, ushering in",
        "role": "assistant"
    },
    {
        "id": "1",
        "content": "go deeper",
        "role": "user"
    },
    {
        "id": "5yUX0qE",
        "createdAt": "2023-09-24T04:26:46.925Z",
        "content": "Certainly",
        "role": "assistant"
    },
    {
        "id": "1",
        "content": "go deeper",
        "role": "user"
    },
    {
        "id": "qfcVLbl",
        "createdAt": "2023-09-24T04:26:56.757Z",
        "content": "Certainly! Let's take a deeper dive into \"The Renaissance Masters: Unveiling the Legends behind the World's Greatest Artworks.\"\n\nThe Renaissance period, spanning from the 14th to the 17th century, witnessed an unprecedented flourishing of artistic expression. Artists like Leonardo da Vinci, Michelangelo, and Raphael, among many others, pushed the boundaries of creativity, realism, and human emotion in their works. Leonardo's \"Mona Lisa\" captivates viewers with its enigmatic smile, while Michelangelo's ceiling frescoes in the Sistine Chapel showcase exquisite mastery. Raphael's \"The School of Athens\" depicts a gathering of great thinkers in a harmonious composition. Through their artistic genius, these masters not only reflected the cultural and intellectual advancements of the time but also left an enduring legacy that continues to inspire and captivate people around the globe.",
        "role": "assistant"
    }
] as Message[]