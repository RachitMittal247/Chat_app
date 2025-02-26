import React from 'react'
import {
    Button,
    HStack,
    Avatar,
    Text,
    Spacer,
  } from "@chakra-ui/react";

const Header = ({user, logoutHandler}) => {
  return (
    <HStack w="full" bg={"teal"} p={'2'} mb={'2'}  borderRadius={"md"}>
    <Text fontSize='3xl' color='white' fontWeight='bold'>WE_TEXTING</Text>
    <Spacer />
    <HStack>
    <Avatar size='sm' src={user} />
    <Button onClick={logoutHandler} colorScheme={"red"}>
      Logout
    </Button>
    </HStack>
    </HStack>
  )
}

export default Header