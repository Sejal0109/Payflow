import { atom, selector } from "recoil";

export const userAtom = atom({
  key: "userAtom",
  default: { username: "", userId: "", usernumber: "", isAuthenticated: false },
});

export const userSelector = selector({
  key: "userSelector",
  get: ({ get }) => {
    const userState = get(userAtom);
    return userState.isAuthenticated;
  },
});
