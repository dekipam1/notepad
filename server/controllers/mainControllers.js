
/**
 * GET /
 * Homepage 
*/
exports.homepage = async (req, res) => {
    const locals = {
      title: "NodeJs Notes",
      description: "Free NodeJS Notes App.",
    }
 
  res.render('index', {
    locals,
    layout: '../views/layouts/front-page'
  });
}



  /**
 * GET /
 * About 
*/
exports.about = async (req, res) => {
  const locals = {
    title: "About - NodeJs Notes",
    description: "Free NodeJS Notes App.",
  }
  res.render('about', locals);
}

  /**
 * GET /
 * logipage 
*/
// exports.loginpage = async (req, res) => {
//   const locals = {
//     title: "login - NodeJs Notes",
//     description: "Free NodeJS Notes App.",
//   }
//   res.render('login', {
//     locals,
//     layout: '../views/layouts/login-front-page'
//   });
// }


