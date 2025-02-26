import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  HStack,
  Input,
  VStack,
  Image ,
  Text,
} from "@chakra-ui/react";
import Message from "./Components/Message";
import { app } from "./firebase";
import {
  onAuthStateChanged,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import Header from "./Components/Header";

const auth = getAuth(app);
const db = getFirestore(app);

const loginHandler = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
};

const logoutHandler = () => signOut(auth);

function App() {
  const [user, setUser] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const divForScroll = useRef(null);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setMessage("");

      await addDoc(collection(db, "Messages"), {
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        name:user.displayName,
        createdAt: serverTimestamp(),
      });

      divForScroll.current.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"));

    const unsubscribe = onAuthStateChanged(auth, (data) => {
      setUser(data);
    });

    const unsubscribeForMessage = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((item) => {
          const id = item.id;
          return { id, ...item.data() };
        })
      );
    });

    return () => {
      unsubscribe();
      unsubscribeForMessage();
    };
  }, []);

  return (
    <Box bg='#212121'>
      {user ? (
        <Container h={"100vh"} bg={"white"}>
          <VStack h="full" paddingY={"4"}>

            <Header user={user.photoURL} logoutHandler={logoutHandler}/>
            <VStack
              h="full"
              w="full"
              overflowY="auto"
              css={{
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {messages.map((item) => (
                <Message
                  key={item.id}
                  user={item.uid === user.uid ? "me" : "other"}
                  text={item.text}
                  uri={item.uri}
                  createdAt={item.createdAt}
                  name={item.name}
                />
              ))}

              <div ref={divForScroll}></div>
            </VStack>

            <form onSubmit={submitHandler} style={{ width: "100%" }}>
              <HStack>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter a Message..."
                />
                <Button colorScheme={"teal"} type="submit">
                  Send
                </Button>
              </HStack>
            </form>
          </VStack>
        </Container>
      ) : (
        <VStack bg="white" justifyContent={"center"} h="100vh">
          <Text fontSize='4xl' fontWeight='bold'>WE_TEXTING</Text>
            <Image
    h={'70vh'}
    objectFit='cover'
    src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp'
    alt='Login In'
  />
          <Button onClick={loginHandler} colorScheme={"purple"}>
            Sign In With Google
          </Button>
        </VStack>
      )}
    </Box>
  );
}

export default App;
