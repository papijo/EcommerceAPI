// const User = require("../models/User");
// const PDFDocument = require("pdfkit");
// const fs = require("fs");
// const router = require("express").Router();
// const sgMail = require("@sendgrid/mail");

// const fileName = "output.pdf";

// //Send email with PDF
// router.get("/", async (req, res) => {
//   // Create a document
//   const doc = new PDFDocument();

//   // Pipe its output somewhere, like to a file or HTTP response
//   // See below for browser usage
//   doc.pipe(fs.createWriteStream(fileName));

//   // Embed a font, set the font size, and render some text
//   doc.fontSize(25).text("Some text with an embedded font!", 100, 100);

//   // Add an image, constrain it to a given size, and center it vertically and horizontally
//   // doc.image("path/to/image.png", {
//   //   fit: [250, 300],
//   //   align: "center",
//   //   valign: "center",
//   // });

//   // Add another page
//   doc.addPage().fontSize(25).text("Here is some vector graphics...", 100, 100);

//   // Draw a triangle
//   doc.save().moveTo(100, 150).lineTo(100, 250).lineTo(200, 250).fill("#FF3300");

//   // Apply some transforms and render an SVG path with the 'even-odd' fill rule
//   doc
//     .scale(0.6)
//     .translate(470, -380)
//     .path("M 250,75 L 323,301 131,161 369,161 177,301 z")
//     .fill("red", "even-odd")
//     .restore();

//   // Add some text with annotations
//   doc
//     .addPage()
//     .fillColor("blue")
//     .text("Here is a link!", 100, 100)
//     .underline(100, 100, 160, 27, { color: "#0000FF" })
//     .link(100, 100, 160, 27, "http://google.com/");

//   // Finalize PDF file
//   doc.end();

//   const file = fs.createReadStream(fileName);
//   // SENDING REPLY TO FRONTEND
//   file.pipe(res);

//   // START SENDING EMAIL
//   let pathToAttachment = fileName;
//   let attachment = fs.readFileSync(pathToAttachment).toString("base64");
//   const msg = {
//     to: "arksonjosiah@gmail.com",
//     from: "joe.ebh100@live.com",
//     subject: "Sending with SendGrid is Fun",
//     text: "and easy to do anywhere, even with Node.js",
//     attachments: [
//       {
//         content: attachment,
//         filename: "attachment.pdf",
//         type: "application/pdf",
//         disposition: "attachment",
//       },
//     ],
//     // Use the email address or domain you verified above
//   };

//   sgMail.send(msg).then(
//     () => {
//       console.log("Message sent!");
//     },
//     (error) => {
//       console.error(error);

//       if (error.response) {
//         console.error(error.response.body);
//       }
//     }
//   );
// });

// module.exports = router;
