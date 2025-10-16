import { VSCodeButton, VSCodeLink } from "@vscode/webview-ui-toolkit/react"
import { memo, useState } from "react"
import styled from "styled-components"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { StateServiceClient } from "@/services/grpc-client"
import { TelemetrySettingEnum, TelemetrySettingRequest } from "@shared/proto/cline/state"

const BannerContainer = styled.div`
	background-color: var(--vscode-banner-background);
	padding: 12px 20px;
	display: flex;
	flex-direction: column;
	gap: 10px;
	flex-shrink: 0;
	margin-bottom: 6px;
	position: relative;
`

const CloseButton = styled.button`
	position: absolute;
	top: 12px;
	right: 12px;
	background: none;
	border: none;
	color: var(--vscode-foreground);
	cursor: pointer;
	font-size: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 4px;
	opacity: 0.7;
	&:hover {
		opacity: 1;
	}
`

const ButtonContainer = styled.div`
	display: flex;
	gap: 8px;
	width: 100%;

	& > vscode-button {
		flex: 1;
	}
`

const TelemetryBanner = () => {
	const { navigateToSettings } = useExtensionState()

	const handleOpenSettings = () => {
		handleClose()
		navigateToSettings()
	}

	const handleClose = async () => {
		try {
			await StateServiceClient.updateTelemetrySetting(
				TelemetrySettingRequest.create({
					setting: TelemetrySettingEnum.ENABLED,
				}),
			)
		} catch (error) {
			console.error("Error updating telemetry setting:", error)
		}
	}

	return (
		<BannerContainer>
			<CloseButton onClick={handleClose} aria-label="关闭横幅并启用遥测">
				✕
			</CloseButton>
			<div>
				<strong>帮助改进 FG-CODE</strong>
				<i>
					<br />
					(并访问实验性功能)
				</i>
				<div style={{ marginTop: 4 }}>
					FG-CODE 收集错误和使用数据以帮助我们修复错误和改进扩展。永远不会发送代码、提示或个人信息。
					<div style={{ marginTop: 4 }}>
						您可以在{" "}
						<VSCodeLink href="#" onClick={handleOpenSettings}>
							设置
						</VSCodeLink>
						中关闭此设置。
					</div>
				</div>
			</div>
		</BannerContainer>
	)
}

export default memo(TelemetryBanner)
