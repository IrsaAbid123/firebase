"use client"
import React, { useEffect, useState } from "react";
import { auth, googleProvider, facebookProvider, generateToken, messaging } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  linkWithCredential,
  getAuth,
  FacebookAuthProvider,
  signInWithCredential
} from "firebase/auth";
import { onMessage } from "firebase/messaging";

const Auth = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log(payload)
    })
  }, [])

  // Function that gets triggered when clicking the sign-in button
  const signin = async () => {
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Signed in:", userCredential.user);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error during sign-in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const SignOut = async () => {
    try {
      setIsLoading(true);
      await signOut(auth);
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Error while signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with Google
  const signinWithGoogle = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Signed in with Google:", result.user);
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with Facebook
  const facebookLogin = async () => {
    try {
      setIsLoading(true);

      // Request additional Facebook permissions
      facebookProvider.addScope("user_birthday");
      facebookProvider.setCustomParameters({
        'display': 'popup'
      });

      const result = await signInWithPopup(auth, facebookProvider);
      console.log("Signed in with Facebook:", result.user);

      // The signed-in user info.
      const user = result.user;

      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;
      console.log("Facebook Access Token:", accessToken);

    } catch (error: any) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        // Handle linking Facebook credential to the existing account
        const email = error.customData?.email;
        const credential = FacebookAuthProvider.credentialFromError(error);

        try {
          const signInMethods = await auth.fetchSignInMethodsForEmail(email);

          if (signInMethods.length) {
            // Prompt user to sign in with the other provider
            const otherProvider = signInMethods[0]; // Choose the first sign-in method for simplicity
            const otherCredential = await promptUserToSignInWithOtherProvider(otherProvider, email);

            // Link the Facebook credential to the existing account
            const userCredential = await linkWithCredential(auth.currentUser, credential);

            console.log("Linked with Facebook:", userCredential.user);
          }
        } catch (linkingError) {
          console.error("Error linking Facebook credential:", linkingError);
        }
      } else {
        console.error("Error during Facebook sign-in:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Prompt user to sign in with other provider (e.g., Google) and return credential
  const promptUserToSignInWithOtherProvider = async (providerType: string, email: string) => {
    // Implement your method for prompting user to sign in with other provider
    // This could involve redirecting to a sign-in page or showing a modal
    throw new Error("Not implemented");
  };

  return (
    <div>
      <input
        type="text"
        value={email}
        placeholder="Email..."
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        placeholder="Password..."
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={signin} disabled={isLoading}>Sign in</button>

      {/* Authentication with Google */}
      <button onClick={signinWithGoogle} disabled={isLoading}>Sign in with Google</button>

      {/* Sign out button */}
      <button onClick={SignOut} disabled={isLoading}>Sign Out</button>

      {/* Sign in with Facebook */}
      <button onClick={facebookLogin} disabled={isLoading}>Log in with Facebook</button>
    </div>
  );
};

export default Auth;
