export const shapeVariables = () => `
  --border-radius-small: 4px;
  --border-radius-medium: 6px;
  --border-radius-large: 12px;
  --border-radius-xLarge: 20px;
  --border-radius-xxLarge: 24px;

  --border-width-1: 1px;
  --border-width-2: 2px;
  --border-width-3: 3px;
  --border-width-4: 4px;

  --shadow-1: 0px 0.5px 3px rgba(0, 0, 0, 0.1);
  --shadow-2: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-3:  0px 2px 7px 0px #14142b0f;
  --shadow-4: 0px 4px 10px 0px #00000033;

  --gradient-1:  linear-gradient(
    to bottom,
    #007bff 0%,
    #007bff 20%,
    #5a57c3 60%,
    #5a57c3 100%,
    #e91e63 100%
  );
  --gradient-2: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.07) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  --gradient-3: linear-gradient(90deg, #ff7e5f, #feb47b);

  --transition-1: all 0.3s ease-in-out;
`;

export default shapeVariables;
