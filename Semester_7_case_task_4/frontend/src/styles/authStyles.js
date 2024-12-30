const authStyles = {
  main: {
    width: "100vw", // Полная ширина экрана
    height: "100vh", // Полная высота экрана
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    alignItems: "center",
    justifyContent: "center", // Центрируем форму по вертикали и горизонтали
    backgroundImage: "radial-gradient(circle, rgba(254,196,102,1) 0%, rgba(16,96,164,0.8295912114845938) 82%)",
    backgroundSize: "cover", // Обеспечивает заполнение всего экрана
    backgroundPosition: "center", // Центрует фон
    margin: 0, // Убирает внешние отступы
    padding: 0, // Убирает внутренние отступы
  },
  card: {
    width: "400px", // Ограничиваем ширину формы
    padding: "2em",
    background: "white",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Добавляем лёгкую тень
    borderRadius: "8px", // Закруглённые углы
  },
  avatar: {
    margin: "1em",
    display: "flex",
    justifyContent: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1em", // Расстояние между полями формы
  },
  actions: {
    marginTop: "1em",
  },
};

export default authStyles;
