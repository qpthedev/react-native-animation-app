import React, { useRef, useState } from "react";
import { Animated, Dimensions, PanResponder, Text, View } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import icons from "./icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: lightblue;
`;

const Card = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  width: 250px;
  height: 250px;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.8);
  elevation: 50;
  position: absolute;
`;

const Btn = styled.Pressable`
  margin: 0px 30px;
`;

const BtnContainer = styled.View`
  flex-direction: row;
  flex: 1;
`;

const CardContainer = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
`;

export default function App() {
  // Values
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.Value(0)).current;
  const rotation = position.interpolate({
    inputRange: [-250, 250],
    outputRange: ["-15deg", "15deg"],
  });
  const secondScale = position.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [1, 0.5, 1],
    extrapolate: "clamp",
  });

  // Animations
  const onPressIn = Animated.spring(scale, {
    toValue: 0.95,
    useNativeDriver: true,
  });

  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });

  const goCenter = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true,
  });

  const goLeft = Animated.spring(position, {
    toValue: -SCREEN_WIDTH - 100,
    tension: 5,
    useNativeDriver: true,
    restSpeedThreshold: 100,
    restDisplacementThreshold: 100,
  });

  const goRight = Animated.spring(position, {
    toValue: SCREEN_WIDTH + 100,
    tension: 5,
    useNativeDriver: true,
    restSpeedThreshold: 100,
    restDisplacementThreshold: 100,
  });

  // PanResponders
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => onPressIn.start(),
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -250) {
          goLeft.start(onDismiss);
        } else if (dx > 250) {
          goRight.start(onDismiss);
        } else {
          Animated.parallel([onPressOut, goCenter]).start();
        }
      },
      onPanResponderMove: (_, { dx }) => {
        position.setValue(dx);
      },
    })
  ).current;

  // State
  const [index, setIndex] = useState(0);

  const onDismiss = () => {
    scale.setValue(1);
    position.setValue(0);
    setIndex((prev) => prev + 1);
  };

  const closePress = () => {
    goRight.start(onDismiss);
  };

  const checkPress = () => {
    goLeft.start(onDismiss);
  };

  return (
    <Container>
      <CardContainer>
        <Card
          style={{
            transform: [{ scale: secondScale }],
          }}
        >
          <Ionicons name={icons[index + 1]} color="#192a56" size={90} />
        </Card>

        <Card
          {...panResponder.panHandlers}
          style={{
            // connect values to transformationr
            transform: [
              { scale },
              { translateX: position },
              { rotateZ: rotation },
            ],
          }}
        >
          <Ionicons name={icons[index]} color="#192a56" size={90} />
        </Card>
      </CardContainer>
      <BtnContainer>
        <Btn onPress={checkPress}>
          <Ionicons name={"checkmark"} color="white" size={50} />
        </Btn>
        <Btn onPress={closePress}>
          <Ionicons name={"close"} color="white" size={50} />
        </Btn>
      </BtnContainer>
    </Container>
  );
}
