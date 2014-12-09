using System.Collections.Generic;

namespace d3Test.Models.ViewModels
{
    public class SalesViewModel
    {
        public string BouquetType { get; set; }
        public IList<proc_GPTest_GetProductCount_Result> Bouquets { get; set; }
    }
}