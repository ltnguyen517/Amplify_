import React, {useEffect, useRef, useState} from "react";
import { NavLink, Link, useParams, useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as actionthunksPlaylist from "../../store/playlist";
import * as followingPlaylistAct from "../../store/followingplaylist";
import * as audioplayerActions from "../../store/audioplayer"
import AudioPlayerComponent from "../Audioplayer/Audioplayer";
import PlaylistsOfUser from "../PlaylistsOfUser/PlaylistsOfUser";
import ProfileDropDown from "../ProfileDropDown/ProfileDropDown";
import logo from "./logo.png";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import "./Navbar.css";

const NavBar = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const location = useLocation()
    const sessionUser = useSelector((state) => state.session.user)
    let nav = document.getElementById("headnavbar")
    const playlistState = useSelector((state) => state.playlist)
    const followingPlaylistState = useSelector((state) => state.followingPlaylist)
    const [isDisabled, setIsDisabled] = useState(false)
    const audioState = useSelector((state) => state.audioplayer)
    const [playlistsFollowing, setPlaylistsFollowing] = useState([])
    const [playlistsUser, setPlaylistsUser] = useState([])

    let playlists
    let followingPlaylist

    useEffect(async () => {
        playlists = await dispatch(actionthunksPlaylist.getAllPlaylists())
        await dispatch(followingPlaylistAct.getAllPlFollowed(sessionUser?.id))
    }, [dispatch, sessionUser?.id])

    if (location.pathname === "/" && nav) {
        nav.style.background = "#111111"
        nav.style.backgroundImage = "none"
    }
    if (location.pathname === "/login" && nav) {
        nav.style.background = "white"
    }

    const playlistArr = Object.values(playlistState)
    const followedPlaylistsArr = Object.values(followingPlaylistState)


    let userPlaylists
    let lengthUserPlaylists

    if(sessionUser){
        userPlaylists = playlistArr.filter(playlist => playlist?.User?.id === sessionUser?.id)
        lengthUserPlaylists = userPlaylists.length + 1
    }

    // last left off

    let sidenav
    let navbar
    let bottomnav

    const createPlaylist = async (e) => {
        if(lengthUserPlaylists > 6){
            return window.alert("You're only able to create a maximum of 6 playlists")
        }
        e.preventDefault()
        const brandNewPlaylist = {
            "creator_id": sessionUser.id,
            "title": `My Playlist #${lengthUserPlaylists}`,
            "description": "Write a description for your new playlist here.",
            "playlist_picture": "https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large?v=v2&px=999"
        }

      let new_playlist = await dispatch(actionthunksPlaylist.createPlaylist(brandNewPlaylist))
      if (new_playlist) {
        history.push(`/playlist/${new_playlist.id}`)
        setIsDisabled(true)
        setTimeout(() => setIsDisabled(false), 500)
      }
    }
    // if (location.pathname === "/likes") {
    //   sidenav = (
    //     <div className='side-nav' style={{ color: "#adb3b3" }}>

    //       <Link to="/" style={{ textDecoration: "none" }}>
    //         <i class="fa-solid fa-house" style={{ color: "#b3b3b3" }}></i>
    //         &nbsp;
    //         Home</Link>


    //       <br />
    //       <button className='create-playlist-button' onClick={createPlaylist} disabled={isDisabled}>
    //         <i class="fa-solid fa-square-plus"></i>
    //         &nbsp;
    //         Create playlist
    //       </button>

    //       <div style={{ borderBottom: "1px solid gray" }}><br /></div>
    //       <br />


    //     </div>
    //   )
    //   navbar = (
    //     <nav id="top-navbar" style={{ backgroundColor: "#513a9e", backgroundImage: "none" }}>
    //       <div style={{ marginRight: "30px" }}>
    //         <Link to={{ pathname: "https://github.com/ltnguyen517/Amplify" }} target="_blank">
    //           <i style={{ color: "white", marginTop: "20%" }} class="fa-brands fa-github fa-lg"></i>
    //         </Link>

    //       </div>

    //     </nav>
    //   )


    // }
    if (location.pathname !== "/sign-up" && location.pathname !== "/login" && !sessionUser) {
      sidenav = (
        <div className='side-nav' style={{ color: "#adb3b3" }}>
          <div style={{ marginBottom: "20px" }} id='logo'>
            <img onClick={(e) => history.push("/")} style={{ width: "155px", height: "45px", cursor: "pointer" }} src={logo} />
          </div>
          <div>
            <Link to="/">
              <i class="fa-solid fa-house" style={{ color: "#b3b3b3" }}></i>
              &nbsp;
              Home</Link>

          </div>


        </div>
      )
      navbar = (
        <nav id="top-navbar">
          <div style={{ marginRight: "30px" }}>
            <Link to={{ pathname: "https://github.com/ltnguyen517/Amplify" }} target="_blank">
              <i style={{ color: "white", marginTop: "20%" }} class="fa-brands fa-github fa-lg"></i>
            </Link>

          </div>
          <div className='login-signup' style={{ display: "flex", marginRight: "60px" }}>
            <div style={{ paddingTop: "10px", marginRight: "10px" }}>
              <button style={{ fontSize: "18px", fontWeight: "700", background: "none" }} id='signup-nav-button' onClick={(e) => history.push("/sign-up")}>
                Sign Up
              </button>
            </div>
            <button id='login-nav-button' onClick={(e) => history.push("/login")}>
              Log In
            </button>
          </div>
        </nav>
      )
      bottomnav = (
        <div className='logged-out-bottom-div-container'>
          <div className='logged-out-text'>
            &nbsp;
            <div style={{ fontSize: "13px", marginLeft: "12px", marginBottom: "5px" }}>
              PREVIEW OF AMPLIFY
            </div>
            <div style={{ marginLeft: "12px", fontWeight: "550" }}>
              Sign up to get unlimited songs and podcasts with occasional ads. No credit card needed.
            </div>
          </div>
          <button style={{ marginTop: "12px", borderRadius: "30px", height: "50px", width: "150px", fontWeight: "700", border: "none", cursor: "pointer", marginRight: "10px" }} onClick={(e) => history.push("/sign-up")}>Sign up free</button>
        </div>
      )
    } else if (sessionUser && location.pathname !== "/sign-up" && location.pathname !== "/login" && location.pathname !== "/likes") {
      sidenav = (
        <div className='side-nav' style={{ color: "#adb3b3" }}>
          <div style={{ marginBottom: "5px" }} id='logo'>
            <img onClick={(e) => history.push("/")} style={{ width: "150px", height: "75px", cursor: "pointer", marginLeft: "11.5px" }} src={logo} />
          </div>

          <Link to="/" style={{ textDecoration: "none" }}>
            <i class="fa-solid fa-house" style={{ color: "#b3b3b3" }}></i>
            &nbsp;
            Home</Link>

          <br />
          <button className='create-playlist-button' onClick={createPlaylist} disabled={isDisabled}>
            <i class="fa-solid fa-square-plus"></i>
            &nbsp;
            Create Playlist
          </button>

          <div style={{ borderBottom: "1px solid gray" }}><br /></div>
          <br />

          <div style={{ overflowY: "scroll" }}>
            <div className='user-playlist-div'>
              <PlaylistsOfUser />
              {followedPlaylistsArr && (
                followedPlaylistsArr.map((playlist) => {
                  return <div>
                    <Link to={`/playlist/${playlist.id}`}>{playlist.title}</Link>
                  </div>
                })
              )}
            </div>
          </div>

        </div>
      )
      navbar = (
        <nav id="top-navbar">
          <div className='profddright' style={{ marginRight: "115px" }}>
            <ProfileDropDown />
          </div>
        </nav>
      )
      if (audioState.current_song.length > 0) {
        bottomnav = (
          audioState.current_song.length > 0 && (
            <div className='bottom-div-container'>
              <div className='audio-container' style={{ display: "flex", marginLeft: "20px" }}>
                <div className='bottom-nav-image-container' style={{ display: "flex" }}>
                  <img style={{ width: "80px" }} src={audioState.current_song[0].album.album_photo}></img>
                  <div className='bottom-div-album-name-artist-container' style={{ display: "flex", flexDirection: "column", marginLeft: "20px", marginTop: "15px", width: "300px" }}>
                    <Link id='bottom-nav-album-link' to={`/album/${audioState.current_song[0].album.id}`}>{audioState.current_song[0].name}</Link>
                  </div>
                </div>
                <div style={{ marginLeft: "50px" }}>
                  <AudioPlayerComponent />
                </div>
              </div>
            </div>
          )
        )
      } else {
        bottomnav = (
          <div className='bottom-div-container'>
            <div style={{ marginLeft: "230px" }}>
              <AudioPlayerComponent/>
            </div>
          </div>
        )
      }
    } else if (location.pathname === "/login") {
      navbar = (
        <nav id='logging-in-signing-up-nav'>
          <div id="login-signup-page">
            <Link to="/">
              <img className='logo-img' src={logo}></img>
            </Link>
          </div>
        </nav>
      )
    }

    return (
      <>
        {navbar}
        {sidenav}
        {bottomnav}
      </>
    );


}
export default NavBar;
