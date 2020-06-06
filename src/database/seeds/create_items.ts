import Knex from "knex"

export async function seed(knex: Knex){
  await knex('items').insert([
        {title: "Máscaras", image: "mascaras.png"},
        {title: "Luvas", image: "luvas.png"},
        {title: "Protetor Facial", image: "protetorfacial.svg"},
        {title: "Agasalhos", image: "agasalhos.png"},
        {title: "Macacão Cirurgico", image: "macacao.png"},
        {title: "Alimentos", image: "alimentos.png"},
    ])
}