export const Hero = () => {
  const bgStyle = {
    backgroundImage: "url('/images/books.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  };
  return (
    <div className="bg-cover">
      <div className="overlay"></div>
      <div className="content text-center">
        <h1 className="display-4">Welcome to your ONLINE timetable</h1>
        <p className="lead">
          Manage your courses, timetable, attendance, and more.
        </p>
        <a href="#about" className="btn btn-primary">
          Learn More
        </a>
      </div>
    </div>
  );
};
