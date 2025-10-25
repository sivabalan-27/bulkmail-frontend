import axios from 'axios';
import { useState } from 'react';
import * as XLSX from 'xlsx';

function App() {
  const [msg, setmsg] = useState("");
  const [status, setstatus] = useState(false);
  const [emailList, setemailList] = useState([]);

  // Handle message input
  function handlemsg(e) {
    setmsg(e.target.value);
  }

  
  function handlefile(evt) {
    const file = evt.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      const workBook = XLSX.read(data, { type: "binary" });
      const sheetName = workBook.SheetNames[0];
      const sheet = workBook.Sheets[sheetName];

      
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const emails = rows.map(row => row[0]).filter(email => email); 

      setemailList(emails);
    };

    reader.readAsBinaryString(file);
  }

  // Send emails
  function send() {
    if (!msg.trim()) return alert("Please enter a message");
    if (!emailList.length) return alert("Please upload at least one email");

    setstatus(true);

    axios.post("https://bulkmailbackend-2.onrender.com/sendemail", { msg, emailList })
      .then((response) => {
        response.data === true
          ? alert("Email sent successfully")
          : alert("Failed to send email");
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        alert("Server error or bad request");
      })
      .finally(() => setstatus(false));
  }

  return (
    <>
      <div className='bg-black text-white text-center'>
        <h1 className='text-2xl font-medium px-5 py-3'>BulkMail</h1>
      </div>
      <div className='bg-black/80 text-white text-center'>
        <h1 className='font-medium px-5 py-3'>We can help your business with sending multiple E-Mail at once</h1>
      </div>
      <div className='bg-black/80 text-white text-center'>
        <h1 className='font-medium px-5 py-3'>Drag and Drop</h1>
      </div>
      <div className="bg-black/80 flex flex-col items-center px-5 py-3 text-black pb-80" >
        <textarea
          onChange={handlemsg}
          value={msg}
          className="w-[80%] h-40 py-2 outline-none px-2 border border-black rounded-md bg-black/30 text-white"
          placeholder="Enter the e-mail text..."
        />
        <div>
          <input
            onChange={handlefile}
            type="file"
            className="border-2 border-dashed text-white px-3 py-3 mt-7 mb-2 cursor-pointer"
          />
        </div>
        <p className='text-white'>Total e-mails in the file: {emailList.length}</p>
        <button
          onClick={send}
          className="bg-blue-950 py-2 px-4 font-medium text-white rounded-md w-fit mt-3 hover:bg-blue-700"
        >
          {status ? "sending" : "send"}
        </button>
      </div>
    </>
  );
}

export default App;
