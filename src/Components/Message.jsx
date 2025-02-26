import React from 'react'
import { HStack, Avatar, Text, Badge } from "@chakra-ui/react"

const Message = ({ text, uri, createdAt, user, name}) => {
    return (
        <HStack alignSelf={user === "me" ? "flex-end" : "flex-start"} borderRadius={"base"} bg="gray.200" paddingY={"2"} paddingX={"2"} maxW={'70%'}>
            <Avatar src={uri} />
            <Text maxW={'80%'}>
              <Badge colorScheme='green'>
                {name}
               </Badge>
               <Text>{text}</Text>
            </Text>
        </HStack>
    )
}

export default Message