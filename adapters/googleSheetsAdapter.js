import dotenv from 'dotenv';
import  { GoogleSpreadsheet}  from 'google-spreadsheet';
dotenv.config({ path: '../variables.env' });

export const getDataPromise = async () => {
  // the unique id of the google sheet
    const doc = new GoogleSpreadsheet(
    "159efLdr8IKpCdeInKCYjIo0Xd-qKcS9GmZQbXw_l3nM"
  );
  
  // connect with Google sheets
  await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
  })

  await doc.loadInfo();
  // only get the first sheet
  const sheet = doc.sheetsByIndex[0];
  
  // get all the data from this sheet.
  const rows = await sheet.getRows();

  // only pass on the row data from the sheets
  const filteredRows = rows.map((row) => row._rawData);
  
  return filteredRows;
};

// (async function () {
//   // getDataPromise();
//     // getDataPromise().then(v => console.log(v));
//     const rows = await getDataPromise();
//     console.log(rows);
// })();
