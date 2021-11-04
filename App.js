import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  Text,
  View,
} from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import icons from "./icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BLACK_COLOR = "#1e272e";
const GRAY = "#485460";
const GREEN = "#2ecc71";
const RED = "#e74c3c";

const Container = styled.View`
  flex: 1;
  background-color: ${BLACK_COLOR};
`;

const Edge = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const WordContainer = styled(Animated.createAnimatedComponent(View))`
  width: 80px;
  height: 80px;
  justify-content: center;
  align-items: center;
  background-color: ${GRAY};
  border-radius: 40px;
`;

const Word = styled.Text`
  font-size: 25px;
  font-weight: 500;
  color: ${(props) => props.color};
`;

const Center = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const IconCard = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  padding: 5px 10px;
  border-radius: 10px;
`;

export default function App() {
  // Values
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scaleOne = position.y.interpolate({
    inputRange: [-200, -120],
    outputRange: [2, 1],
    extrapolate: "clamp",
  });
  const scaleTwo = position.y.interpolate({
    inputRange: [120, 200],
    outputRange: [1, 2],
    extrapolate: "clamp",
  });
  const opacity = useRef(new Animated.Value(1)).current;

  // Animations
  const onPressIn = Animated.spring(scale, {
    toValue: 0.5,
    useNativeDriver: true,
  });

  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });

  const goHome = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true,
  });

  const onDropScale = Animated.timing(scale, {
    toValue: 0,
    easing: Easing.linear,
    duration: 50,
    useNativeDriver: true,
  });

  const onDropOpacity = Animated.timing(opacity, {
    toValue: 0,
    easing: Easing.linear,
    duration: 50,
    useNativeDriver: true,
  });

  // PanResponders
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onPressIn.start();
      },
      onPanResponderRelease: (_, { dy }) => {
        if (dy < -190 || dy > 190) {
          // drop
          Animated.sequence([
            Animated.parallel([onDropScale, onDropOpacity]),
            Animated.timing(position, {
              toValue: 0,
              easing: Easing.linear,
              duration: 50,
              useNativeDriver: true,
            }),
          ]).start(nextIcon);
        } else {
          Animated.parallel([onPressOut, goHome]).start();
        }
      },
      onPanResponderMove: (_, { dx, dy }) => {
        // console.log(dy);
        position.setValue({ x: dx, y: dy });
      },
    })
  ).current;

  // State
  const [index, setIndex] = useState(0);
  const nextIcon = () => {
    setIndex((prev) => prev + 1);
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(opacity, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Container>
      <Edge>
        <WordContainer
          style={{
            transform: [{ scale: scaleOne }],
          }}
        >
          <Word color={GREEN}>Know</Word>
        </WordContainer>
      </Edge>
      <Center>
        <IconCard
          {...panResponder.panHandlers}
          style={{
            opacity,
            transform: [...position.getTranslateTransform(), { scale }],
          }}
        >
          <Ionicons name={icons[index]} color={GRAY} size={120} />
        </IconCard>
      </Center>
      <Edge>
        <WordContainer
          style={{
            transform: [{ scale: scaleTwo }],
          }}
        >
          <Word color={RED}>Don't Know</Word>
        </WordContainer>
      </Edge>
    </Container>
  );
}
