import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
// import Confetti from "react-confetti";
import toast from "react-hot-toast";
import Psa from "../components/Psa";
import { BACKEND_URL } from "../constants";
import { studentResources as resources } from "../data/dummy_data";

export default function StudentDashboard() {
  const [fullName, setFullName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [evalStatus, setEvalStatus] = useState("");
  const [blogLink, setBlogLink] = useState("");
  const [projects, setProjects] = useState([]);

  // const { width, height } = useWindowSize();

  const [stats, setStats] = useState({});

  const [pulls, setPulls] = useState([]);

  const [extraCommits, setExtraCommits] = useState([]);
  const [extraLinesAdded, setExtraLinesAdded] = useState(0);
  const [extraLinesRemoved, setExtraLinesRemoved] = useState(0);

  const details = {
    bloglink: blogLink,
    username: localStorage.getItem("student_username"),
  };

  // TODO: update this before release
  const announcements = [
    {
      date: "November 20, 2021",
      content: "Coding Period will start from 7th December",
    },
  ];

  const handleBlogLink = () => {
    // TODO: check this regex because there were some problems previous year
    const urlMatch = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.@~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-@]*)?" + // query string
        "(\\#[:-a-z\\d_]*)?$",
      "i"
    );

    if (!urlMatch.test(blogLink)) {
      toast.error("Not a valid blog link. Please correct and submit again.", {
        duration: 4000,
      });
    } else {
      axios
        .post(`${BACKEND_URL}/student/bloglink`, details, {
          headers: {
            Bearer: localStorage.getItem("student_jwt"),
          },
        })
        .then((res) => {
          toast.success(
            "Blog submitted, thank you for participating in KWoC this year.",
            {
              duration: 4000,
            }
          );
        })
        .catch((err) => {
          alert("Server error, Try again");
          console.log(err);
        });
    }
  };

  useEffect(() => {
    const student_username = localStorage.getItem("student_username");

    const student_loggedout =
      localStorage.getItem("student_jwt") === null ||
      localStorage.getItem("student_jwt") === undefined;
    if (student_loggedout) window.location.pathname = "";
    const URL = `${BACKEND_URL}/student/dashboard`;
    const data = {
      username: localStorage.getItem("student_username"),
    };

    fetch(URL, {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        setFullName(res.name);
        setCollegeName(res.college);
        setEvalStatus(res.evals);
      })
      .catch((err) => {
        // alert("Server Error, Please try again");
        console.log("err is ", err);
      });

    // axios
    //   .get(`${BACKEND_URL}/stats/student/${student_username}`)
    //   .then((res) => {
    //     setStats(res.data[student_username]);
    //     console.log(res.data[student_username]);
    //   })
    //   .catch((err) => {
    //     alert("Server error, Try again");
    //   });
  }, []);

  let resourceList = [];
  for (const [index, elements] in resources.entries()) {
    resourceList.push(<li key={index}>{elements}</li>);
  }

  function removeCachedTimeStamp() {
    const student_username = localStorage.getItem("student_username");
    localStorage.removeItem(`stats_events_timestamp_${student_username}`);
    window.location.reload();
  }

  function resendForm() {
    setEvalStatus(1);
  }

  return (
    <div className="dashboard-container">
      {/* {evalStatus === 2 && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )} */}
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <h2>{fullName}</h2>

            <div className="stats">
              {/* <div className="box">
                <h2>{stats["commits"] && stats["commits"].length}</h2>
                <p>Commits</p>
              </div>

              <div className="box">
                <h2>{stats["pulls"] !== undefined && stats["pulls"].length}</h2>
                <p>Pull Requests</p>
              </div>

              <div className="box">
                <h2>
                  {trim_lines(parseInt(stats["lines_added"]))}/
                  {trim_lines(parseInt(stats["lines_removed"]))}
                </h2>
                <p>Lines of Code (+/-)</p>
              </div> */}

              <div className="box">
                <h2>
                  {moment("07-12-2022", "DD-MM-YYYY").diff(
                    moment.now(),
                    "days"
                  )}
                </h2>
                <p>Days to go</p>
              </div>

              {/* <div>
              <a
                href={
                  "kwoc.kossiitkgp/stats/student/" +
                  localStorage.getItem("student_username")
                }
              >
                Link to Detailed Stats
              </a>
            </div> */}
            </div>
          </div>

          <div className="avatar">
            <img
              src={`https://github.com/${localStorage.getItem(
                "student_username"
              )}.png`}
              alt="User's GitHub Avatar"
            ></img>

            <div className="avatar-content">
              <h2>{fullName}</h2>
              <p>{localStorage.getItem("student_username")}</p>
              <p>{collegeName}</p>
            </div>
          </div>

          {/* TODO: see and improve Psa component to handle multiple announcements better */}
          <Psa announcement={announcements[0].content} />
        </div>
        {/* <div className="subtitle">
          <h1>End Evaluation</h1>

          <div className="field">
              <label className="label">Blog Link</label>
              <div className="control">
                <input
                  type="text"
                  placeholder="Link of blog"
                  defaultValue=""
                  onChange={(e) => setBlogLink(e.target.value)}
                />
                <button onClick={handleBlogLink}>Submit</button>
              </div>
            </div>

          <div className="feedback">
            {evalStatus === 2 ? (
              <>
                <p>
                  {" "}
                  Congratulations. You have successfully passed as a student
                  developer in KWoC 2021.
                </p>
                <a
                  href={`https://kossiitkgp.org/public-files/KWoC/2021-Certificates/Student/${localStorage.getItem(
                    "student_username"
                  )}.pdf`}
                  target="_blank"
                  rel="noopener norefferer"
                >
                  Link to your certificate
                </a>
              </>
            ) : (
              <p>
                {" "}
                We regret to inform you that your contributions in KWoC were not
                up to the mark. However, we do not wish to discourage you from
                participating further in open source development. Contributing
                to open source is a continuous learning process and we hope you
                take this in your stride and do well the next time.
              </p>
            )}

            <p>
              Thank you for participating in KWoC, hope you learned something
              new regardless of the result.
            </p>
          </div>
        </div>
        <Toaster position="bottom-center" />
        <div className="feedback">
          <p>
            Help us make KWoC a better experience for everyone by filling this
            anonymous{" "}
            <a
              href="https://forms.gle/speJb3ihYqX6711A6"
              rel="noreferrer noopener"
              target="_blank"
            >
              feedback form
            </a>
            .
          </p>
        </div> */}

        {/* <div className="subtitle">
          <h1>Languages</h1>

          <div className="languages">
            {stats["languages"] !== undefined &&
              stats["languages"].map((item) => <span>{item}</span>)}
          </div>
        </div>

        <div className="subtitle">
          <h1>Projects</h1>

          <div className="languages">
            {stats["projects"] !== undefined &&
              stats["projects"].map((item) => (
                <span>
                  <a href={`https://github.com/${item}`}>{item}</a>
                </span>
              ))}
          </div>
        </div>

        <div className="subtitle">
          <h1>
            Pull Reqests
            <img
              alt=""
              src={reloadIcon}
              className="refresh-icon"
              onClick={removeCachedTimeStamp}
            />
          </h1>
          <div className="dashboard-table">
            {stats["pulls"] !== undefined ? (
              <table>
                <thead>
                  <tr>
                    <th>
                      <h3>Project</h3>
                    </th>
                    <th>
                      <h3>Pull Request</h3>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {stats["pulls"].map((item) => {
                    return (
                      <tr>
                        <td>
                          <a
                            href={`https://github.com/${item["base"]["repo"]["full_name"]}`}
                          >
                            {item["base"]["repo"]["full_name"]}
                          </a>
                        </td>

                        <td>
                          <a href={item["html_url"]}>
                            {trim_message(item["title"])}
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="subtitle">
          <h1>Commits</h1>

          <div className="dashboard-table">
            {stats["commits"] !== undefined && extraCommits !== undefined ? (
              <table>
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Commit</th>
                    <th>Lines</th>
                  </tr>
                </thead>

                <tbody>
                  {stats["commits"].map((item) => {
                    return (
                      <tr>
                        <td>
                          <a
                            className="project-in-commit-table"
                            href={`https://github.com/${item["project"]}`}
                          >
                            {item["project"]}
                          </a>
                        </td>
                        <td>
                          <a href={item["html_url"]}>
                            {trim_message(item["message"])}
                          </a>
                        </td>
                        <td>
                          +{trim_lines(item["lines_added"])},-
                          {trim_lines(item["lines_removed"])}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              ""
            )}
          </div>
          <p className="dashboard-table-message">
            View on Desktop to see commits
          </p>
        </div> */}

        <section className="resource-table subtitle">
          <h1>Resources</h1>

          <table>
            <tbody>
              {resources.map((resourceCard) => {
                const message = resourceCard.message;
                const url = resourceCard.url;
                const avatar = resourceCard.avatar;

                return (
                  <tr>
                    <td>
                      <a href={url}>
                        {/* TODO: default image/icon for broken links */}
                        <img
                          src={avatar}
                          className="avatar-resource"
                          alt="link"
                        ></img>
                      </a>
                    </td>
                    <td>
                      <a href={url}>{message}</a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* <div className="announcements">
            <h1>Announcements</h1>

            {announcements.map((item, index) => {
              return (
                <div className="anc-card card-component grow-card">
                  <h1>{item.date}</h1>
                  <p>{item.content}</p>
                </div>
              );
            })}
          </div> */}
      </div>
    </div>
  );
}
