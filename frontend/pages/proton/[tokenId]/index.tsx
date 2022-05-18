import { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  Button,
  Image,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useMediaQuery,
  RadioGroup,
  Stack,
  Radio
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import CatalogItem from "../../components/catalogItem";
import Shop from "../../artifacts/contracts/Shop.sol/Shop.json";
import { handleImageUpload } from "../../utils/ipfs";
import TransactionItem from "../../components/transactionItem";
import web3 from "web3";
import { formatAddress } from "../../utils/web3";
import { getAffiliates, makeAffiliateProposal, updateAffiliate } from "../../utils/shop";
import { BigNumber } from "bignumber.js";
import Web3Modal from "web3modal";

interface Props {}

interface CartType {
  qty: number;
  itemId: string;
}

const ProtonPage = (props: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [owner, setOwner] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isDigital, setIsDigital] = useState<string>("DIGITAL");
  const [digitalProductFile, setDigitalProductFile] = useState<string>("");
  const [proposedAffiliates, setProposedAffiliates] = useState([]);
  const [activeAffiliates, setActiveAffiliates] = useState([]);
  const [percent, setPercent] = useState("3");

  const [itemName, setItemName] = useState<string>("");
  const [itemDesc, setItemDesc] = useState<string>("");
  const [itemImage, setItemImage] = useState<string>("");
  const [itemPrice, setItemPrice] = useState<string>("");

  const [items, setItems] = useState<any>([]);
  const [transactions, setTransactions] = useState<any>([]);
  const [isMobile] = useMediaQuery("(max-width: 600px)");

  const web3React = useWeb3React();

  const provider = ethers.getDefaultProvider(process.env.NEXT_PUBLIC_NETWORK);

  const router = useRouter();
  useEffect(() => {
      
  }, []);
  useEffect(() => {
    setIsOwner(web3React.account === owner);
    console.log("addr changed isOwner: ", isOwner);
  }, [web3React.account, web3React, owner]);
  console.log("addr: ", web3React.account);
  
  if (!router.query.shop) {
    return <h1>Try navigating to this page from the home page</h1>;
  }
  
  const renderAffiliateTab = () => {
    if (isOwner) {
      return (
        <Flex flexDirection="column" justify="center">
          <Text fontSize="2xl" fontWeight="bold" mb="2">Proposals:</Text>
            {proposedAffiliates.filter((aff: any) => aff.percentage?.toString() != '0').map((aff: any) => renderAffiliate(aff, false))}
          <Text fontSize="2xl" fontWeight="bold" mb="2">Active:</Text>
            {activeAffiliates.filter((aff: any) => aff.percentage?.toString() != '0').map((aff: any) => renderAffiliate(aff, true))}
        </Flex>
        );
    }
    return (
      <Box>
        <Box>
          <Text>Proposals:</Text>
            {
              proposedAffiliates
                .filter((aff: any) => aff.affAddr == web3React.account)
                .map((aff: any) => {
                  return (
                    <Box>
                      <Text fontWeight="bold" fontSize="xl">Your Affiliate proposal for {aff.percentage?.toString()}% is pending</Text>
                    </Box>
                  )
                })
            }
          <Text>Active:</Text>
            {
              activeAffiliates
                .filter((aff: any) => aff.affAddr == web3React.account)
                .map((aff: any) => {
                  return (
                    <Box>
                      <Text fontWeight="bold" fontSize="xl"> <a href={`${window.location.href}/${web3React.account}`}>Here is your affiliate link for {aff.percentage?.toString()}%:</a></Text>
                    </Box>
                  )
                })
            }
        </Box>
      
        <Text fontSize="xl">Become an Affiliate: </Text>
        <Flex direction="column" justify="center">
          <Text mb="2">Proposal for a % of each affiliate sale:</Text>
          <Input
            placeholder="percentage"
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
            mb="4"
          />
          <Button
            onClick={() =>
              makeAffiliateProposal(
                provider,
                router.query.shop,
                Shop.abi,
                percent
              )
            }
          >
            submit
          </Button>
        </Flex>
      </Box>
    );
  };
  return (
    <Box>
      <Flex justify={"center"} align={"center"} direction={"column"}>
        <Box m="6" width={isMobile ? "100%" : "600px"} textAlign="center">
          <Flex
            justify="center"
            align="center"
            direction={isMobile ? "column" : "row"}
          >
            {/* <Box width={isMobile ? "90%" : "200px"} m="2"> */}
            <Image
              borderRadius="12px"
              src={image}
              width={isMobile ? "90%" : "200px"}
              height={isMobile ? "90%" : "200px"}
              mr="6"
            />
            {/* </Box> */}
            <Box>
              {" "}
              <Text fontSize="6xl">{name}</Text>
              <Text color="gray.600">{desc}</Text>
              <Text color="yello.700">stars: {4.75}</Text>
              <Flex mb={"2"} direction="column">
                <Link
                  target={"_blank"}
                  mb={"2"}
                  href={`${process.env.NEXT_PUBLIC_ETHERSCAN}${owner}`}
                  color="gray.600"
                  isExternal
                >
                  <ExternalLinkIcon />
                  owner: {owner.slice(0, 5)}...
                </Link>
                <Link
                  target={"_blank"}
                  mb={"2"}
                  href={`${process.env.NEXT_PUBLIC_ETHERSCAN}${router.query.shop}`}
                  color="gray.600"
                  isExternal
                >
                  <ExternalLinkIcon />
                  shop address: {router.query.shop.slice(0, 5)}...
                </Link>
              </Flex>
              <Flex m={"4"}>
                {isOwner && (
                  <Button mr={"4"} onClick={onOpen}>
                    Add Catalog Item
                  </Button>
                )}
                {isOwner && <Button onClick={handleEdit}>Edit Shop</Button>}
              </Flex>
            </Box>
          </Flex>

          <Tabs>
            <TabList>
              <Tab>Menu</Tab>
              <Tab>Transactions</Tab>
              <Tab>Affiliates</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Flex justify={"center"} align={"center"} direction={"column"}>
                  {items.map((elem: any) => (
                    <CatalogItem data={elem} shopAddress={router.query.shop} isOwner={isOwner} />
                  ))}
                </Flex>
              </TabPanel>
              <TabPanel>
                <Flex justify={"center"} align={"center"} direction={"column"}>
                  {transactions.map((elem: any) => (
                    <TransactionItem
                      data={elem}
                      shopAddress={router.query.shop}
                      currentAddress={web3React.account}
                    />
                  ))}
                </Flex>
              </TabPanel>
              <TabPanel>
                <Flex justify={"center"} align={"center"} direction={"column"}>
                  {renderAffiliateTab()}
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a new catalog item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex justify="center">
              <Image
                borderRadius="12px"
                src={itemImage ? itemImage : "/images/placeholder-image.png"}
                width="200px"
                height="200px"
              />
            </Flex>
            <Input
              placeholder="item name"
              value={itemName}
              onChange={(e: any) => setItemName(e.target.value)}
              mt={4}
            />
            <Input
              placeholder="description"
              value={itemDesc}
              onChange={(e: any) => setItemDesc(e.target.value)}
              mt={4}
            />
            <Input
              placeholder="price"
              value={itemPrice}
              onChange={(e: any) => setItemPrice(e.target.value)}
              mt={4}
            />
            <RadioGroup mt={4} onChange={setIsDigital} value={isDigital}>
              <Stack direction='row'>
                <Radio value='PHYSICAL'>Physical Product</Radio>
                <Radio value='DIGITAL'>Digital Product</Radio>
                <Radio disabled={true} value='NFT'>NFT (soon to come)</Radio>
              </Stack>
            </RadioGroup>
            {
              isDigital === 'DIGITAL' ? (
                <Box mt={"4"}>
                  <Text mb={"2"}>Upload Digital Product</Text>
                  <input
                    type="file"
                    name="Asset"
                    className="mr-2"
                    onChange={(e: any) => uploadDigitalProduct(e)}
                  />
              </Box>
              ) : ""
            }
            <Box mt={"4"}>
              <Text mb={"2"}>Upload Product Image</Text>
              <input
                type="file"
                name="Asset"
                className="mr-2"
                onChange={(e: any) => uploadImage(e)}
              />
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Create Item
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProtonPage;
