const chatGreetings: string[] = [
  "Hola 👋, ¿sobre qué tema legal te gustaría hablar hoy?",
  "Bienvenido, ¿en qué aspecto del derecho colombiano puedo ayudarte?",
  "¿Tienes alguna duda legal? Estoy aquí para orientarte.",
  "¿Buscas información sobre una ley o un procedimiento específico?",
  "Puedo ayudarte a entender leyes, derechos o trámites en Colombia.",
  "Cuéntame tu caso y te explico qué dice la ley.",
  "¿Quieres saber qué ley aplica a tu situación?",
  "Puedo ayudarte a interpretar artículos del Código Civil, Penal o Laboral.",
  "Te ayudo a entender tus derechos según la legislación colombiana.",
  "¿Necesitas orientación sobre un proceso legal? Empecemos.",
  "¡Hola! Soy tu asistente legal virtual 🇨🇴 ¿Sobre qué tema quieres aprender hoy?",
  "Dime tu duda legal y la revisamos juntos.",
  "¿Problemas con un contrato, multa o trámite? Veamos qué dice la ley.",
  "¿Te gustaría conocer tus derechos en una situación específica?",
  "Aquí estoy para aclarar tus dudas sobre leyes en Colombia.",
  "Puedes preguntarme sobre derecho laboral, civil, penal, familiar y más.",
  "No doy asesoría jurídica personalizada, pero sí puedo explicarte las normas.",
  "Te puedo mostrar los artículos del código que aplican a tu caso.",
  "Empieza escribiendo tu pregunta, por ejemplo: “¿Qué dice la ley sobre despido injustificado?”",
  "Pregunta libremente sobre cualquier ley o trámite colombiano."
];

export function getRandomChatGreeting(): string {
  const index = Math.floor(Math.random() * chatGreetings.length);
  return chatGreetings[index];
}
