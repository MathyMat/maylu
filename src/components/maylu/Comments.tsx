import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "@/lib/supabase.ts";

import img0 from "@/assets/maylu/maylugaleria/WhatsApp Image 2026-06-17 at 12.52.38 AM.jpeg";
import img1 from "@/assets/maylu/maylugaleria/WhatsApp Image 2026-06-17 at 12.52.37 AM.jpeg";
import img2 from "@/assets/maylu/maylugaleria/WhatsApp Image 2026-06-17 at 12.52.33 AM (1).jpeg";
import img3 from "@/assets/maylu/maylugaleria/WhatsApp Image 2026-06-17 at 12.52.31 AM.jpeg";
import img4 from "@/assets/maylu/maylugaleria/WhatsApp Image 2026-06-17 at 12.52.20 AM.jpeg";
import img5 from "@/assets/maylu/maylugaleria/WhatsApp Image 2026-06-17 at 12.52.15 AM.jpeg";
import img6 from "@/assets/maylu/maylugaleria/WhatsApp Image 2026-06-17 at 12.52.11 AM.jpeg";
import img7 from "@/assets/maylu/maylugaleria/WhatsApp Image 2026-06-17 at 12.52.09 AM.jpeg";
import img8 from "@/assets/maylu/maylugaleria/WhatsApp Image 2026-06-17 at 12.52.07 AM.jpeg";
import img9 from "@/assets/maylu/maylugaleria/WhatsApp Image 2026-06-17 at 12.51.57 AM.jpeg";
import img10 from "@/assets/maylu/maylugaleria/WhatsApp Image 2026-06-17 at 12.51.48 AM (1).jpeg";

const AVATARS = [img0, img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];

type Comment = {
  id: string;
  user_id: string;
  username: string;
  message: string;
  photo_url: string | null;
  avatar_idx: number;
  likes: number;
  parent_id: string | null;
  created_at: string;
};

function getUserId(): string {
  try {
    let id = localStorage.getItem("userId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("userId", id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

const USER_ID = getUserId();

function timeAgo(date: string) {
  try {
    return formatDistanceToNow(new Date(date + "Z"), { addSuffix: true, locale: es });
  } catch {
    return "ahora";
  }
}

function AvatarImg({ idx, name, size, onClick }: { idx: number; name: string; size?: "sm" | "md"; onClick?: () => void }) {
  const cls = size === "sm" ? "h-12 w-12 text-sm" : "h-14 w-14 text-base";
  if (idx >= 0 && idx < AVATARS.length) {
    return (
      <button type="button" onClick={onClick} className="block">
        <img src={AVATARS[idx]} alt="avatar" className={`shrink-0 rounded-full object-cover ${cls}`} />
      </button>
    );
  }
  return (
    <span className={`shrink-0 grid place-items-center rounded-full bg-butter font-bold text-cocoa ${cls}`}>
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

function CommentCard({
  c,
  isReply,
  likedIds,
  replyingTo,
  replyMessage,
  submitting,
  repliesByParent,
  expandedReplies,
  toggleExpandReplies,
  toggleLike,
  setReplyingTo,
  setReplyMessage,
  onSubmitReply,
  onCancelReply,
  setLightboxUrl,
}: {
  c: Comment;
  isReply?: boolean;
  likedIds: Set<string>;
  replyingTo: string | null;
  replyMessage: string;
  submitting: boolean;
  repliesByParent: Record<string, Comment[]>;
  toggleLike: (id: string) => void;
  setReplyingTo: (id: string | null) => void;
  setReplyMessage: (v: string) => void;
  onSubmitReply: (e: React.FormEvent) => void;
  onCancelReply: () => void;
  setLightboxUrl: (url: string | null) => void;
}) {
  const replies = repliesByParent[c.id];
  const replyRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (replyingTo === c.id && replyRef.current) {
      replyRef.current.focus();
    }
  }, [replyingTo, c.id]);

  return (
    <div>
      <div className={`flex gap-4 ${isReply ? "mt-4" : ""}`}>
        {isReply && <div className="mt-1 w-5 shrink-0 self-stretch border-l-2 border-cocoa/10" />}
        <div className="shrink-0 mt-0.5">
          <AvatarImg idx={c.avatar_idx} name={c.username} size={isReply ? "sm" : "md"} onClick={() => setLightboxUrl(AVATARS[c.avatar_idx] ?? null)} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-3">
            {c.username === "Maylu" ? (
              <span className="text-base font-bold text-honey">Maylu 👑</span>
            ) : (
              <span className="text-base font-semibold text-cocoa">{c.username}</span>
            )}
            <span className="text-sm text-cocoa/40">{timeAgo(c.created_at)}</span>
          </div>
          <p className="mt-1 text-base text-cocoa/80 whitespace-pre-wrap break-words">{c.message}</p>
          {c.photo_url && (
            <button type="button" onClick={() => setLightboxUrl(c.photo_url)} className="block mt-3">
              <img src={c.photo_url} alt="foto" className="max-h-48 rounded-xl object-cover" />
            </button>
          )}
          <div className="mt-2 flex items-center gap-4">
            <button
              type="button"
              onClick={() => toggleLike(c.id)}
              className="flex items-center gap-1.5 text-sm font-semibold transition hover:scale-110"
            >
              <span className={likedIds.has(c.id) ? "" : "opacity-40 hover:opacity-100"}>
                {likedIds.has(c.id) ? "❤️" : "🤍"}
              </span>
              {c.likes > 0 && <span className="text-cocoa/60">{c.likes}</span>}
            </button>
            {!isReply && (
              <button
                type="button"
                onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
                className="text-sm font-semibold text-cocoa/50 hover:text-cocoa"
              >
                Responder
              </button>
            )}
          </div>
          {replyingTo === c.id && (
            <form onSubmit={onSubmitReply} className="mt-4 flex items-center gap-3">
              <input
                ref={replyRef}
                type="text"
                placeholder={`Responde a ${c.username}...`}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                maxLength={200}
                className="min-w-0 flex-1 rounded-xl border-2 border-cocoa/20 bg-cream px-4 py-2.5 text-sm text-cocoa placeholder:text-cocoa/40 focus:border-honey focus:outline-none"
              />
              <button
                type="submit"
                disabled={submitting || !replyMessage.trim()}
                className="rounded-full bg-honey px-5 py-2 text-sm font-bold text-cocoa transition hover:bg-butter disabled:opacity-40"
              >
                {submitting ? "..." : "Responder"}
              </button>
              <button type="button" onClick={onCancelReply} className="text-sm text-cocoa/40 hover:text-cocoa">
                Cancelar
              </button>
            </form>
          )}
        </div>
      </div>
      {(expandedReplies.has(c.id) ? replies : replies?.slice(0, 2))?.map((r) => (
        <CommentCard
          key={r.id}
          c={r}
          isReply
          likedIds={likedIds}
          replyingTo={replyingTo}
          replyMessage={replyMessage}
          submitting={submitting}
          repliesByParent={repliesByParent}
          expandedReplies={expandedReplies}
          toggleExpandReplies={toggleExpandReplies}
          toggleLike={toggleLike}
          setReplyingTo={setReplyingTo}
          setReplyMessage={setReplyMessage}
          onSubmitReply={onSubmitReply}
          onCancelReply={onCancelReply}
          setLightboxUrl={setLightboxUrl}
        />
      ))}
      {!isReply && replies && replies.length > 2 && (
        <button
          type="button"
          onClick={() => toggleExpandReplies(c.id)}
          className="mt-3 ml-[76px] text-sm font-semibold text-cocoa/50 hover:text-cocoa"
        >
          {expandedReplies.has(c.id)
            ? "Ver menos respuestas"
            : `Ver más respuestas (${replies.length - 2} ocultas)`}
        </button>
      )}
    </div>
  );
}

export function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [username, setUsername] = useState(() => {
    try { return localStorage.getItem("username") || ""; } catch { return ""; }
  });
  const [nameLocked, setNameLocked] = useState(() => {
    try { return !!localStorage.getItem("username"); } catch { return false; }
  });
  const [avatarIdx, setAvatarIdx] = useState(() => {
    try { const v = localStorage.getItem("avatarIdx"); return v ? Number(v) : -1; } catch { return -1; }
  });
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [message, setMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const pickerRef = useRef<HTMLDivElement>(null);

  const topLevel = comments.filter((c) => !c.parent_id);
  const repliesByParent = comments.reduce<Record<string, Comment[]>>((acc, c) => {
    if (c.parent_id) {
      (acc[c.parent_id] ??= []).push(c);
    }
    return acc;
  }, {});

  useEffect(() => {
    function loadComments() {
      supabase
        .from("comments")
        .select("*")
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          if (data) setComments(data as Comment[]);
        });
    }
    function loadLikes() {
      supabase
        .from("comment_likes")
        .select("comment_id")
        .eq("user_id", USER_ID)
        .then(({ data }) => {
          if (data) setLikedIds(new Set(data.map((l: { comment_id: string }) => l.comment_id)));
        });
    }
    loadComments();
    loadLikes();

    const channel = supabase.channel("comments-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "comments" }, (payload: { new: Comment }) => {
        setComments((prev) => [payload.new, ...prev]);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "comments" }, (payload: { new: Comment }) => {
        setComments((prev) => prev.map((c) => (c.id === payload.new.id ? { ...c, likes: payload.new.likes } : c)));
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "comments" }, (payload: { old: Comment }) => {
        setComments((prev) => prev.filter((c) => c.id !== payload.old.id));
      })
      .subscribe();

    const pollId = setInterval(loadComments, 5000);
    return () => { supabase.removeChannel(channel); clearInterval(pollId); };
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowAvatarPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function pickAvatar(idx: number) {
    setAvatarIdx(idx);
    setShowAvatarPicker(false);
    try { localStorage.setItem("avatarIdx", String(idx)); } catch {}
  }

  async function handleSubmit(e: React.FormEvent, isReply = false) {
    e.preventDefault();
    const isPapa = (() => { try { return localStorage.getItem("isPapa") === "true"; } catch { return false; } })();
    const trimmedUser = isPapa ? "Maylu" : username.trim();
    const trimmedMsg = (isReply ? replyMessage : message).trim();
    if (!trimmedUser || !trimmedMsg) return;

    const today = new Date().toISOString().slice(0, 10);
    const { count } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", USER_ID)
      .gte("created_at", today);
    if (count && count >= 5) {
      toast.custom(() => (
        <div className="flex items-center gap-3 rounded-2xl border-2 border-blush bg-blush/40 px-5 py-3 shadow-lg backdrop-blur">
          <span className="text-lg">⏳</span>
          <div>
            <p className="font-display text-sm font-bold text-cocoa">Límite diario alcanzado</p>
            <p className="text-xs text-cocoa/70">Solo puedes enviar 5 comentarios por día.</p>
          </div>
        </div>
      ), { duration: 4000 });
      return;
    }

    setSubmitting(true);

    await supabase.from("comments").insert({
      user_id: USER_ID, username: trimmedUser, message: trimmedMsg, photo_url: null, avatar_idx: avatarIdx, parent_id: replyingTo,
    });

    localStorage.setItem("username", trimmedUser);
    setNameLocked(true);
    if (isReply) { setReplyMessage(""); setReplyingTo(null); } else { setMessage(""); }
    setSubmitting(false);

    toast.custom(() => (
      <div className="flex items-center gap-3 rounded-2xl border-2 border-honey bg-butter/90 px-5 py-3 shadow-lg backdrop-blur">
        <span className="text-lg">✅</span>
        <div>
          <p className="font-display text-sm font-bold text-cocoa">Comentario enviado</p>
          <p className="text-xs text-cocoa/70">{trimmedMsg.slice(0, 60)}{trimmedMsg.length > 60 ? "..." : ""}</p>
        </div>
      </div>
    ), { duration: 3000 });
  }

  function toggleExpandReplies(id: string) {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  async function toggleLike(commentId: string) {
    const had = likedIds.has(commentId);
    if (had) {
      await supabase.from("comment_likes").delete().eq("comment_id", commentId).eq("user_id", USER_ID);
      await supabase.rpc("decrement_likes", { comment_id: commentId });
      setLikedIds((prev) => { const next = new Set(prev); next.delete(commentId); return next; });
      setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, likes: Math.max(0, c.likes - 1) } : c));
    } else {
      await supabase.from("comment_likes").insert({ comment_id: commentId, user_id: USER_ID });
      await supabase.rpc("increment_likes", { comment_id: commentId });
      setLikedIds((prev) => { const next = new Set(prev); next.add(commentId); return next; });
      setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, likes: c.likes + 1 } : c));
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h2 className="font-display text-2xl font-bold text-cocoa sm:text-3xl mb-8">enviale un comentario a maylu!!!</h2>

      <form onSubmit={(e) => handleSubmit(e, false)} className="mb-10 flex items-start gap-4">
        <div className="relative shrink-0 mt-1">
          <button type="button" onClick={() => setShowAvatarPicker(!showAvatarPicker)} className="relative block">
            <span className="absolute -top-8 left-full ml-3 text-nowrap text-sm font-semibold text-honey underline-offset-2 hover:underline">✏️ elige un mayluavatar!</span>
            <AvatarImg idx={avatarIdx} name={username || "?"} />
          </button>
          {showAvatarPicker && (
            <div ref={pickerRef} className="absolute left-0 top-full mt-3 z-50 w-[90vw] sm:w-[540px] md:w-[720px] rounded-2xl border-2 border-cocoa/20 bg-cream p-6 sm:p-8 shadow-xl">
              <p className="mb-4 sm:mb-5 text-base sm:text-lg font-semibold text-cocoa/60 text-center">Elige tu avatar</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
                {AVATARS.map((src, i) => (
                  <button key={i} type="button" onClick={() => pickAvatar(i)}
                    className={`rounded-xl border-2 p-0.5 transition hover:scale-105 ${avatarIdx === i ? "border-honey bg-butter/30" : "border-transparent"}`}>
                    <img src={src} alt="" className="aspect-square w-full rounded-lg object-cover" />
                  </button>
                ))}
                <button type="button" onClick={() => pickAvatar(-1)}
                  className={`rounded-xl border-2 p-1 transition ${avatarIdx === -1 ? "border-honey bg-butter/30" : "border-transparent"}`}>
                  <span className="grid aspect-square w-full place-items-center rounded-lg bg-butter text-sm font-bold text-cocoa">{avatarLetter(username || "?")}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="relative">
            <input type="text" placeholder="Tu nombre..." value={username} onChange={(e) => setUsername(e.target.value)}
              maxLength={30} readOnly={nameLocked}
              className="block w-full rounded-xl border-2 border-cocoa/20 bg-cream px-5 py-3 pr-12 text-base text-cocoa placeholder:text-cocoa/40 focus:border-honey focus:outline-none read-only:opacity-60 read-only:cursor-default" />
            {username && (
              <button type="button" onClick={() => setNameLocked(!nameLocked)}
                className="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-lg text-cocoa/50 transition hover:bg-butter/40 hover:text-cocoa"
                title={nameLocked ? "Editar nombre" : "Bloquear nombre"}>
                {nameLocked ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                )}
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <input type="text" placeholder={replyingTo ? "Escribe tu respuesta..." : "Escribe un comentario..."}
              value={message} onChange={(e) => setMessage(e.target.value)} maxLength={200}
              className="min-w-0 flex-1 rounded-xl border-2 border-cocoa/20 bg-cream px-5 py-3 text-base text-cocoa placeholder:text-cocoa/40 focus:border-honey focus:outline-none" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-cocoa/40">{message.length}/200</span>
            <div className="flex items-center gap-3">
              {replyingTo && (
                <button type="button" onClick={() => { setReplyingTo(null); setReplyMessage(""); }}
                  className="text-sm text-cocoa/40 hover:text-cocoa">Cancelar respuesta</button>
              )}
              <button type="submit" disabled={submitting || !username.trim() || !message.trim()}
                className="rounded-full bg-honey px-7 py-2 text-sm font-bold text-cocoa transition hover:bg-butter disabled:opacity-40">
                {submitting ? "Enviando..." : replyingTo ? "Responder" : "Comentar"}
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {topLevel.map((c) => (
          <CommentCard key={c.id} c={c} likedIds={likedIds} replyingTo={replyingTo} replyMessage={replyMessage}
            submitting={submitting} repliesByParent={repliesByParent}
            expandedReplies={expandedReplies} toggleExpandReplies={toggleExpandReplies}
            toggleLike={toggleLike} setReplyingTo={setReplyingTo} setReplyMessage={setReplyMessage}
            onSubmitReply={(e) => handleSubmit(e, true)} onCancelReply={() => { setReplyingTo(null); setReplyMessage(""); }}
            setLightboxUrl={setLightboxUrl} />
        ))}
        {comments.length === 0 && (
          <p className="text-center text-base text-cocoa/40 py-10">No hay comentarios aún. ¡Sé el primero!</p>
        )}
      </div>

      {lightboxUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setLightboxUrl(null)}>
          <button type="button" onClick={() => setLightboxUrl(null)}
            className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white/20 text-2xl text-white hover:bg-white/40">✕</button>
          <img src={lightboxUrl} alt="foto ampliada" className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}

function avatarLetter(name: string) {
  return name.charAt(0).toUpperCase();
}
