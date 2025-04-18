﻿using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace GestiónInventarioBackend.Models
{
    public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required(ErrorMessage = "El ID del cliente es requerido.")]
        [ForeignKey("Customer")] 
        public int CustomerId { get; set; }
        public Customer Customer { get; set; } 


        [Required(ErrorMessage = "La fecha del pedido es requerida.")]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime OrderDate { get; set; }

        public decimal Subtotal { get; set; }

        public decimal Iva { get; set; } 

        public decimal Total { get; set; }

        public List<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
    }
}
