using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace d3Test.Controllers.Api
{
    public class SalesTtbController : ApiController
    {
        public List<proc_Finance_TTB_ByBouquet_Result> Get(int year, string month, int count)
        {
            var unlimitedDataWarehouseEntitiesDb = new UnlimitedDataWarehouseEntities();

            string yearMonth = "" + year + "" + month;

            return unlimitedDataWarehouseEntitiesDb.proc_Finance_TTB_ByBouquet(Convert.ToInt32(yearMonth), count).ToList();
        }
    }
}
