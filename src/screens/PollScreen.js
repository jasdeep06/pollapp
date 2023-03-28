import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";

import { AxiosContext } from "../context/AxiosContext";
import ElevatedBox from "../components/ElevatedBox";
import { Ionicons } from "@expo/vector-icons";
import Loader from "../components/Loader";
import ProgressBar from "../components/ProgressBar";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useFocusEffect } from "@react-navigation/native";

// import { dummyData } from "../data/pollDummyData";



// import  {dummyData}  from "../data/pollDummyData"

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  return `#${r.padStart(2, "0")}${g.padStart(2, "0")}${b.padStart(2, "0")}`;
}

function randomSoothingColor() {
  console.log("Generating random soothing color...");
  const hue = Math.floor(Math.random() * 361);
  const saturation = Math.floor(Math.random() * 26) + 25;
  const lightness = Math.floor(Math.random() * 21) + 20;

  console.log("generated ", hslToHex(hue, saturation, lightness));
  return hslToHex(hue, saturation, lightness);
}

function lightenColor(hexColor, percent) {
  // Remove the '#' from the hex color
  const sanitizedHex = hexColor.replace("#", "");

  // Convert the hex color to RGB
  const r = parseInt(sanitizedHex.substring(0, 2), 16);
  const g = parseInt(sanitizedHex.substring(2, 4), 16);
  const b = parseInt(sanitizedHex.substring(4, 6), 16);

  // Increase the brightness by the given percentage
  const newR = Math.min(Math.round(r * (1 + percent / 100)), 255);
  const newG = Math.min(Math.round(g * (1 + percent / 100)), 255);
  const newB = Math.min(Math.round(b * (1 + percent / 100)), 255);

  // Convert the RGB values back to hex
  const newHexR = newR.toString(16).padStart(2, "0");
  const newHexG = newG.toString(16).padStart(2, "0");
  const newHexB = newB.toString(16).padStart(2, "0");

  return `#${newHexR}${newHexG}${newHexB}`;
}

const PollScreen = () => {
  // console.log(dummyData);
  // const randomColor = randomSoothingColor();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffleId, setShuffleId] = useState(0);
  const [randomColor, setRandomColor] = useState(randomSoothingColor());
  const [selectedIndex, setSelectedIndex] = useState(null);
  const {authAxios} = React.useContext(AxiosContext);
  const [polls, setPolls] = useState(null);
  const [isPollsLoading, setIsPollsLoading] = useState(true);
  const [isSendingResponse, setIsSendingResponse] = useState(false);

  const handleSkip = () => {
    if (currentIndex < polls.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShuffleId(0);
      setSelectedIndex(null);
    }
  };

  const getPolls = async () => {
    const response = await authAxios.get("/get_polls");
    if(response.data.status == 0){
      setPolls(response.data.data);
      setIsPollsLoading(false);
    }
  }

  const handleShuffle = () => {
    if (shuffleId < 2) {
      setShuffleId(shuffleId + 1);
    }
  };

  const sendResponse  = async (shuffleId,selectedIndex) => {
    setIsSendingResponse(true);
    const response = await authAxios.post("/register_response",{
      question_id: polls[currentIndex].question_id,
      selected_id: polls[currentIndex].options.slice(4*shuffleId,4*shuffleId+4)[selectedIndex].user_id,
      option_list: polls[currentIndex].options.slice(4*shuffleId,4*shuffleId+4)
    })
    if(response.data.status == 0){
      console.log("response sent");
      setIsSendingResponse(false);
    }

  }
  const handleOptionSelect = (shuffleId, selectedIndex) => {
    setSelectedIndex(selectedIndex);
    console.log("doing");
    console.log("Selected index: ", selectedIndex, " Shuffle id: ", shuffleId);
    console.log(polls[currentIndex].options.slice(4*shuffleId,4*shuffleId+4))
    console.log(polls[currentIndex].options.slice(4*shuffleId,4*shuffleId+4)[selectedIndex].user_id)
    sendResponse(shuffleId,selectedIndex)

  };

  useEffect(() => {
    setRandomColor(randomSoothingColor());
  }, [currentIndex]);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBackgroundColor(randomColor);
      StatusBar.setBarStyle("light-content");
    }, [randomColor])
  );

  useEffect(() => {
    console.log("getting polls...")
    getPolls();
  },[])
  
  return (
    <View style={[styles.container, { backgroundColor: randomColor }]}>
      <Text style={styles.pollText}>Poll</Text>
      <ProgressBar
        colorHex={"#FFFFFF"}
        style={styles.progressBar}
        minThickness={0.5}
        maxThickness={3}
        totalSteps={12}
        stepSize={1}
        currentStep={currentIndex + 1}
      />
      <Text style={styles.stepText}>{currentIndex + 1}/12</Text>
      {!isPollsLoading ? <View style={styles.content}>
        <View>
          <Image
            source={{ uri: polls[currentIndex].image }}
            style={styles.image}
          />
          <Text style={styles.questionText}>
            {polls[currentIndex].question}
          </Text>
        </View>
        <View style={styles.column}>
          {getOptionView(
            polls,
            shuffleId,
            currentIndex,
            randomColor,
            selectedIndex,
            handleOptionSelect
          )}
        </View>
        {selectedIndex == null ? (
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.shuffleButton}
              onPress={handleShuffle}
              disabled={shuffleId == 2}
            >
              <Ionicons
                name="shuffle"
                size={32}
                color={shuffleId == 2 ? "black" : "white"}
              />
              <Text
                style={[
                  styles.footerText,
                  shuffleId == 2 && { color: "black" },
                ]}
              >
                Shuffle
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Ionicons
                name="play-skip-forward-sharp"
                size={32}
                color="white"
              />
              <Text style={styles.footerText}>Skip</Text>
            </TouchableOpacity>
          </View>
        ) : (
          getContinueView(isSendingResponse, handleSkip)
        )}
      </View>:<Loader visible={isPollsLoading}/>}
    </View>
  );
};



const renderOption = (
  option,
  index,
  shuffle_id,
  randomColor,
  selectedIndex,
  handleOptionSelect
) => {
  const selected = selectedIndex === index;
  const backgroundColor = selected ? lightenColor(randomColor, 90) : "white";

  return (
    <ElevatedBox
      key={index}
      style={{ flex: 1, padding: 20, backgroundColor }}
      text={option.firstname + " " + option.lastname}
      onPress={() => handleOptionSelect(shuffle_id, index)}
      disabled={selectedIndex != null}
    />
  );
};

const getOptionView = (
  polls,
  shuffle_id,
  currentIndex,
  randomColor,
  selectedIndex,
  handleOptionSelect
) => {
  const sampledOptions = polls[currentIndex]["options"].slice(
    shuffle_id * 4,
    shuffle_id * 4 + 4
  );

  return (
    <>
      <View style={{ flexDirection: "row" }}>
        {sampledOptions
          .slice(0, 2)
          .map((option, index) =>
            renderOption(
              option,
              index,
              shuffle_id,
              randomColor,
              selectedIndex,
              handleOptionSelect
            )
          )}
      </View>
      <View style={{ flexDirection: "row" }}>
        {sampledOptions
          .slice(2, 4)
          .map((option, index) =>
            renderOption(
              option,
              index + 2,
              shuffle_id,
              randomColor,
              selectedIndex,
              handleOptionSelect
            )
          )}
      </View>
    </>
  );
};

const getContinueView = (isSendingResponse,handleSkip) => {
  if(isSendingResponse){
    return <ActivityIndicator/>
  }else{
    return(
    <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.continueText}>Tap to continue</Text>
          </TouchableOpacity>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: getStatusBarHeight(),
  },
  pollText: {
    color: "white",
    textAlign: "center",
    fontSize: 15,
    padding: 2,
  },
  progressBar: {
    padding: 5,
  },
  stepText: {
    color: "white",
    textAlign: "center",
    fontSize: 15,
    padding: 5,
  },
  content: {
    justifyContent: "space-around",
    flex: 1,
    padding: 15,
  },
  image: {
    width: 80,
    height: 80,
    alignSelf: "center",
  },
  questionText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    paddingTop: 20,
  },
  column: {
    flexDirection: "column",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  shuffleButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    padding: 3,
    color: "white",
    fontSize: 20,
  },
  continueText: {
    textAlign: "center",
    color: "white",
    fontSize: 20,
  },
});

export default PollScreen;
