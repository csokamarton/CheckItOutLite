import { Link } from "react-router-dom";
import { Box, Heading, HStack, Stack, useBreakpointValue, useMediaQuery } from "@chakra-ui/react";
import { useState } from "react";
import { IoIosMenu } from "react-icons/io";
import GlobalEntities from "../store/GlobalEntities";


const Header = () => {

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  }

  const logOut = () => {
    localStorage.clear();
  }

  const [isLargerThan480] = useMediaQuery(["(min-width: 480px)"], { ssr: false });

  return (
    <Box zIndex={1} backgroundColor="#0044D7" top="0" position="sticky" padding={5}>
      <HStack display='flex' justifyContent='space-between'>
        <Heading margin={0} color="#F5F5DC">CheckItOut</Heading>

        <button onClick={toggleMenu}><IoIosMenu /></button>

      </HStack>

      {
        isOpen
        &&
        <Stack direction={isLargerThan480 ? "row" : "column"} align={isLargerThan480 ? "center" : "center"} marginTop={5}>
          <Link to="/home"><button onClick={toggleMenu}>Főoldal<br />megtekintése</button></Link>
          <Link to="/newTask"><button onClick={toggleMenu}>Új feladat<br />felvétele</button></Link>
          <Link to="/profile"><button onClick={toggleMenu}>Profil<br />megtekintése</button></Link>
          {GlobalEntities.user.role === "admin" && (
            <Link to="/admin/users">
              <button onClick={toggleMenu}>Admin<br />megtekintése</button>
            </Link>
          )}
          <Link to="/"><button onClick={logOut}>Kijelentkezés</button></Link>
        </Stack>
      }


    </Box>
  );
};

export default Header;
