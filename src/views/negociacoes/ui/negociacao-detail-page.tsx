"use client";

import type { Proposta } from "@entities/proposta";
import { getCurrentUserService } from "@features/auth";
import { AvaliacaoForm, fetchAvaliacoes } from "@features/avaliacoes";
import { ChatPanel } from "@features/chat";
import {
  aceitarPropostaService,
  cancelarPropostaService,
  concluirNegociacaoService,
  ContrapropostaModal,
  fetchNegociacaoById,
  fetchNegociacaoHistory,
  getNegociacaoRelations,
  recusarPropostaService,
} from "@features/negociacao";
import theme from "@shared/config/theme";
import { useAuth } from "@shared/providers/auth-provider";
import { Button } from "@shared/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { spring1 } from "@shared/config/animation";

interface NegociacaoDetailPageProps {
  negociacaoId: string;
}

interface EvaluationTarget {
  id: string;
  nome: string;
}

export function NegociacaoDetailPage({
  negociacaoId,
}: NegociacaoDetailPageProps) {
  const { session } = useAuth();
  const router = useRouter();
  const [proposta, setProposta] = useState<Proposta | null>(null);
  const [history, setHistory] = useState<Proposta[]>([]);
  const [actionError, setActionError] = useState("");
  const [counterOpen, setCounterOpen] = useState(false);
  const [evaluationTarget, setEvaluationTarget] =
    useState<EvaluationTarget | null>(null);
  const [evaluationOpen, setEvaluationOpen] = useState(false);

  useEffect(() => {
    if (!session) return;

    const negotiationHistory = fetchNegociacaoHistory(negociacaoId);
    const proposta = negotiationHistory.at(-1) ?? fetchNegociacaoById(negociacaoId);
    setHistory(negotiationHistory);
    setProposta(proposta);
    if (!proposta || proposta.status !== "CONCLUIDA") return;

    const targetId =
      proposta.compradorId === session.userId
        ? proposta.vendedorId
        : proposta.vendedorId === session.userId
          ? proposta.compradorId
          : null;

    if (!targetId) return;

    const alreadyReviewed = fetchAvaliacoes(targetId).some(
      (avaliacao) =>
        avaliacao.negociacaoId === negociacaoId &&
        avaliacao.avaliadorId === session.userId,
    );
    if (alreadyReviewed) return;

    const targetUser = getCurrentUserService(targetId);
    setEvaluationTarget({
      id: targetId,
      nome: targetUser?.nome ?? "a outra pessoa",
    });
    setEvaluationOpen(true);
  }, [negociacaoId, session]);

  if (!session || !proposta) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center text-muted-foreground">
        Negociação não encontrada ou acesso não autorizado.
      </div>
    );
  }

  const relations = getNegociacaoRelations(proposta);
  const isSeller = proposta.vendedorId === session.userId;
  const proposalAuthorId =
    proposta.autorId ??
    (history.length > 1 ? proposta.vendedorId : proposta.compradorId);
  const canRespond =
    proposta.status === "PENDENTE" && proposalAuthorId !== session.userId;
  const otherName = isSeller
    ? relations.comprador?.nome
    : relations.vendedor?.nome;
  const closed = ["CONCLUIDA", "CANCELADA", "RECUSADA"].includes(
    proposta.status,
  );
  const runAction = (
    action: () => ReturnType<typeof cancelarPropostaService>,
  ) => {
    const result = action();
    if (!result.success) setActionError(result.error);
    else {
      setProposta(result.data);
      setActionError("");
      router.refresh();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring1}
      data-testid="negociacao-detail-page"
      className="flex h-full flex-col"
      style={{ backgroundColor: theme.color.bgBase }}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-0 sm:px-4 sm:py-8">
        <div
          className="mb-3 rounded-xl border p-4"
          style={{
            background: theme.color.bgSurface,
            borderColor: theme.color.border,
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {relations.anuncio?.titulo ?? "Negociação"}
              </p>
              <p className="mt-1 font-display text-2xl font-black uppercase">
                {proposta.status.replaceAll("_", " ")}
              </p>
            </div>
            {proposta.vatOfertado ? (
              <span className="font-display text-xl font-black text-primary">
                {proposta.vatOfertado} VAT
              </span>
            ) : null}
          </div>
          {actionError && (
            <p className="mt-3 text-xs" style={{ color: theme.color.error }}>
              {actionError}
            </p>
          )}
          {!closed && (
            <div className="mt-3 flex flex-wrap gap-2">
              {canRespond && (
                <>
                  <Button
                    size="sm"
                    onClick={() =>
                      runAction(() =>
                        aceitarPropostaService(proposta.id, session.userId),
                      )
                    }
                  >
                    Aceitar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      runAction(() =>
                        recusarPropostaService(proposta.id, session.userId),
                      )
                    }
                  >
                    Recusar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCounterOpen(true)}
                  >
                    Contrapropor
                  </Button>
                </>
              )}
              {proposta.status === "ACEITA" && (
                <Button
                  size="sm"
                  onClick={() =>
                    runAction(() =>
                      concluirNegociacaoService(proposta.id, session.userId),
                    )
                  }
                >
                  Concluir negociação
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  runAction(() =>
                    cancelarPropostaService(proposta.id, session.userId),
                  )
                }
              >
                Cancelar
              </Button>
            </div>
          )}
        </div>
        <div
          className="flex flex-1 flex-col overflow-hidden sm:rounded-2xl"
          style={{
            border: `1px solid ${theme.color.border}`,
            boxShadow: theme.shadow.modal,
            minHeight: 0,
            maxHeight: "calc(100vh - 64px)",
          }}
        >
          <ChatPanel
            negociacaoId={proposta.id}
            currentUserId={session.userId}
            otherUserName={otherName}
            disabled={closed}
            proposta={proposta}
            anuncio={relations.anuncio}
            offeredItems={relations.itensOfertados}
            desiredItems={relations.itensDesejados}
            history={history}
          />
        </div>
      </div>

      {evaluationTarget && (
        <AvaliacaoForm
          open={evaluationOpen}
          onOpenChange={setEvaluationOpen}
          negociacaoId={negociacaoId}
          avaliadoId={evaluationTarget.id}
          avaliadoNome={evaluationTarget.nome}
          onSuccess={() => setEvaluationOpen(false)}
        />
      )}
      <ContrapropostaModal
        proposta={proposta}
        actorId={session.userId}
        open={counterOpen}
        onOpenChange={setCounterOpen}
        onSuccess={() => {
          const updatedHistory = fetchNegociacaoHistory(negociacaoId);
          setHistory(updatedHistory);
          setProposta(updatedHistory.at(-1) ?? null);
        }}
      />
    </motion.div>
  );
}
