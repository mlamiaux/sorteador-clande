import React, { useState } from "react";
import { motion } from "framer-motion";

const shuffleArray = (array: any[]) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const getGroupName = (index: number) => {
  return `Grupo ${String.fromCharCode(65 + index)}`;
};

const Button = ({ onClick, children, className = "" }) => (
  <button
    onClick={onClick}
    className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${className}`}
  >
    {children}
  </button>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white p-4 rounded-lg ${className}`}>{children}</div>
);

const CardContent = ({ children }) => <div>{children}</div>;

export default function SorteoGrupos() {
  const [jugadores, setJugadores] = useState<string[]>([]);
  const [textareaValue, setTextareaValue] = useState<string>("");
  const [grupos, setGrupos] = useState<string[][]>([]);
  const [sorteado, setSorteado] = useState(false);

  const cargarJugadores = () => {
    const nuevos = textareaValue
      .split("\n")
      .map((j) => j.trim())
      .filter((j) => j.length > 0);
    setJugadores(nuevos);
  };

  const sortear = () => {
    const totalJugadores = jugadores.length;
    const cantidadGrupos = Math.floor(totalJugadores / 3);
    if (cantidadGrupos === 0) return;

    const cabezaGrupo = jugadores.slice(0, cantidadGrupos);
    const resto1 = jugadores.slice(cantidadGrupos);
    const segundoGrupo = shuffleArray(resto1.slice(0, cantidadGrupos));
    const resto2 = resto1.slice(cantidadGrupos);
    const tercerGrupo = shuffleArray(resto2.slice(0, cantidadGrupos));
    const sobrantes = shuffleArray(resto2.slice(cantidadGrupos));

    let resultado: string[][] = [];
    for (let i = 0; i < cantidadGrupos; i++) {
      resultado.push([
        cabezaGrupo[i],
        segundoGrupo[i] || "",
        tercerGrupo[i] || "",
      ].filter(Boolean));
    }

    for (let jugador of sobrantes) {
      const posibles = resultado.filter((g) => g.length < 4);
      const elegido = posibles[Math.floor(Math.random() * posibles.length)];
      elegido.push(jugador);
    }

    setGrupos(resultado);
    setSorteado(true);
  };

  const reiniciar = () => {
    setJugadores([]);
    setTextareaValue("");
    setGrupos([]);
    setSorteado(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-start text-center">
      <div className="w-full flex justify-center mb-4">
        <img
          src="/Clande_Open_Serie_transparente.png"
          alt="Clande Open Series"
          className="w-20 sm:w-24 md:w-28 lg:w-32"
        />
      </div>

      {!sorteado && (
        <div className="w-full max-w-2xl flex flex-col items-center">
          <div className="mb-4 w-full">
            <textarea
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
              placeholder="Pegá aquí la lista de jugadores, uno por línea"
              rows={10}
              className="w-full p-2 border rounded resize-none"
            />
            <Button onClick={cargarJugadores} className="mt-2">Cargar Jugadores</Button>
          </div>

          {jugadores.length > 0 && (
            <div className="mb-4 w-full text-left">
              <p className="font-bold mb-2">Jugadores Cargados:</p>
              <div className="border p-4 bg-white rounded shadow">
                <ul className="list-disc list-inside">
                  {jugadores.map((j, i) => (
                    <li key={i}>{j}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {jugadores.length >= 3 && (
            <Button onClick={sortear}>Realizar Sorteo</Button>
          )}
        </div>
      )}

      {sorteado && (
        <div className="w-full flex flex-col items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {grupos.map((grupo, i) => (
              <Card key={i} className="w-64 shadow-xl">
                <CardContent>
                  <h2 className="text-xl font-bold text-center mb-4">
                    {getGroupName(i)}
                  </h2>
                  {grupo.map((jugador, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: j * 0.3 }}
                      className="p-2 border-b"
                    >
                      <span className={j === 0 ? "font-bold" : ""}>{jugador}</span>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 w-full max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">Resumen de Sorteo</h2>
            <table className="w-full table-auto border-collapse bg-white shadow rounded">
              <thead>
                <tr>
                  <th className="border p-2 text-left">Jugador</th>
                  <th className="border p-2 text-left">Grupo</th>
                </tr>
              </thead>
              <tbody>
                {grupos.map((grupo, i) => (
                  grupo.map((jugador, j) => (
                    <tr key={`${i}-${j}`}>
                      <td className="border p-2">
                        <span className={j === 0 ? "font-bold" : ""}>{jugador}</span>
                      </td>
                      <td className="border p-2">{getGroupName(i)}</td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
            <div className="mt-6">
              <Button onClick={reiniciar}>Reiniciar Sorteo</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
