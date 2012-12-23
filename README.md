Careers StackOverflow
======================

This little app does the following :

- 1) it gets the number of pages containing tags on stackeoverflow.com/tags
- 2) for each page a RegEx parses the html body to get the tag names
- 3) then gets the number of pages of job listings on careers.stackoverflow.com
- 4) for each page a RegEx parses the links to job descriptions
- 5) the app follows every link and tries to match each tag name to the job description

This application uses Node.js with the "HTTP" and "fs" modules.

Some statistics :
=================

33746 tags tested on
604 job descriptions matched
249045 times in
26min 18s 580ms
