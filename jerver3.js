// Script.js
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  console.log("Starting script...");
  await sleep(700);
  console.log("Step 1: Preparing...");
  await sleep(600);
  console.log("Step 2: Processing...");
  await sleep(600);

  for (let i = 1; i <= 6; i++) {
  
    console.log(`Progress: ${i}/6`);

    await sleep(500);
  }

  console.log("Finalizing...");
  await sleep(600);
  console.log("All done!");
}

main();