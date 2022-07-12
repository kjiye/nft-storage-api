// Import the NFTStorage class and File constructor from the 'nft.storage' package
import { NFTStorage, File } from "nft.storage";
import { NFT_STORAGE_SECRET } from "./config/settings.js";

// The 'mime' npm package helps us set the correct file type on our File objects
import mime from "mime";

// The 'fs' builtin module on Node.js provides access to the file system
import fs from "fs";

// The 'path' module provides helpers for manipulating filesystem paths
import path from "path";

// Paste your NFT.Storage API key into the quotes:
const NFT_STORAGE_KEY = NFT_STORAGE_SECRET;

/**
 * Reads an image file from `imagePath` and stores an NFT with the given name and description.
 * @param {string} imagePath the path to an image file
 * @param {string} name a name for the NFT
 * @param {string} description a text description for the NFT
 */
async function storeNFT(imagePath, name, description) {
  // load the file from disk
  const image = await fileFromPath(imagePath);

  // create a new NFTStorage client using our API key
  const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });

  // call client.store, passing in the image & metadata
  /**
   * OpenSea metadata standards
   *
   * description : 말 그대로 이미지에 대한 간략한 설명
   * external_url : OpenSea에서 이미지 하단에 표시될 URL. IPFS 외부 환경에서도 해당 이미지 조회를 허용할 때만 입력 (일반 이미지 URL)
   * image : 업로드할 이미지 경로 입력
   * name : 작품명
   * attributes : { trait_type : 특성 유형명, value : 특성 유형에 부여한 식별 값 } 기타 속성 추가 가능
   */

  // 테스트로 객체 하드코딩 상태
  const attributes = {
    trait_type: "Crayon",
    value: "1",
  };

  return nftstorage.store({
    image,
    name,
    description,
    attributes,
  });
}

/**
 * A helper to read a file from a location on disk and return a File object.
 * Note that this reads the entire file into memory and should not be used for
 * very large files.
 * @param {string} filePath the path to a file to store
 * @returns {File} a File object containing the file content
 */
async function fileFromPath(filePath) {
  const content = await fs.promises.readFile(filePath);
  const type = mime.getType(filePath);
  return new File([content], path.basename(filePath), { type });
}

/**
 * The main entry point for the script that checks the command line arguments and
 * calls storeNFT.
 *
 * To simplify the example, we don't do any fancy command line parsing. Just three
 * positional arguments for imagePath, name, and description
 */
async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 3) {
    console.error(
      `usage: ${process.argv[0]} ${process.argv[1]} <image-path> <name> <description>`
    );
    process.exit(1);
  }

  const [imagePath, name, description] = args;
  const result = await storeNFT(imagePath, name, description);
  console.log(result);
}

// Don't forget to actually call the main function!
// We can't `await` things at the top level, so this adds
// a .catch() to grab any errors and print them to the console.
main().catch((err) => {
  console.error(err);
  process.exit(1);
});

/**
 * 실행 스크립트
 * node upload.mjs <image-path> <a name for my token> <a longer description for the token>
 */
