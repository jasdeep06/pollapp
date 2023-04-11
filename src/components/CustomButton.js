import { Text as CustonText, StyleSheet, TouchableOpacity } from "react-native";

import CustomText from "./CustomText";

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
      <CustomText style={{ ...styles.buttonText, ...textStyles }}>{buttonText}</CustomText>
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
