# WD Start Template
Starter template for web development projects. This template is inspired by official [ZURB Template](https://github.com/zurb/foundation-zurb-template) and used as starter point in my web development projects. It has some useful features:

- Handelbars HTML templates with [Panini](https://github.com/zurb/panini) from ZURB Team
- PostCSS processing for styles
- Webpack 3 module bundling for JavaScript files
- Built-in BrowserSync server
- CSS, JS and image compression for **production** builds 

## Installation

To use this template, your computer needs:

- [NodeJS](https://nodejs.org/en/) (8.0 or greater)
- [Git](https://git-scm.com/)

To install template, first download it with Git:

```bash
git clone https://github.com/almakovka/webdev-start-template projectname
```

Then open the folder in your command line, and install all dependencies:

```bash
cd projectname
npm install
```

Finally, run `npm start` or `gulp` to run Gulp. Your finished site will be created in a folder called `dist`, viewable at this URL:

```
http://localhost:5000
```

To create compressed, production-ready assets, run `npm run build` or `gulp --production`.