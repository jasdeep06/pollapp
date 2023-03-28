import { StyleSheet, Text, TouchableOpacity } from "react-native";

const CustomButton = (props) => {
  const { buttonStyles, textStyles, buttonText,icon } = props;
  let buttonStylesModified = null;
  if (Array.isArray(buttonStyles)) {
    buttonStylesModified = Object.assign({}, ...buttonStyles);
  } else {
    buttonStylesModified = buttonStyles;
  }

  return (
    <TouchableOpacity
      style={{ ...styles.button, ...buttonStylesModified }}
      {...props}
    >
      {icon}
      <Text style={{ ...styles.buttonText, ...textStyles }}>{buttonText}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    backgroundColor: "transparent",
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    flexDirection:"row"
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default CustomButton;
