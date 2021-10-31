import React, { useRef, useState } from "react";
import { Animated, Pressable } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Box = styled.View`
  background-color: tomato;
  width: 200px;
  height: 200px;
`;

const AnimatedBox = Animated.createAnimatedComponent(Box);

export default function App() {
  const Y_POSITION = useRef(new Animated.Value(200)).current;
  const [up, setUp] = useState(false);
  const toggleUp = () => setUp((prev) => !prev);

  const moveUp = () => {
    Animated.timing(Y_POSITION, {
      toValue: up ? 200 : -200,
      duration: 2000,
      useNativeDriver: true,
    }).start(toggleUp);
  };

  const opacity = Y_POSITION.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [1, 0.5, 1],
  });

  const borderRadius = Y_POSITION.interpolate({
    inputRange: [-200, 200],
    outputRange: [100, 0],
  });

  return (
    <Container>
      <Pressable onPress={moveUp}>
        <AnimatedBox
          style={{
            opacity,
            borderRadius,
            transform: [{ translateY: Y_POSITION }],
          }}
        />
      </Pressable>
    </Container>
  );
}
