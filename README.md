Careers StackOverflow
======================

This little app does the following :

- 1) Gets the number of pages filled with tags on stackeoverflow.com/tags
- 2) For each page a RegEx parses the html to get the tag names
- 3) Gets the number of pages of job listings on careers.stackoverflow.com
- 4) For each page a RegEx parses the links to the job descriptions
- 5) The app follows every link and trys to match each tag name to the job description

This application uses Node.js with the "HTTP" and "fs" modules.
