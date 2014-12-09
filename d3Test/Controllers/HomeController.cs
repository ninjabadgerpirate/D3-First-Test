using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace d3Test.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            return View();
        }

        public ActionResult Test()
        {
            ViewBag.Title = "Test Page";

            return View();
        }

        public ActionResult Force()
        {
            ViewBag.Title = "Force Page";

            return View();
        }
    }
}
